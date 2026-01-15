import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../product/product.entity';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private dataSource: DataSource,
    @Inject('ORDER_SERVICE') private readonly client: ClientProxy,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { customerId, items } = createOrderDto;

    // Use a transaction to ensure atomic order creation and stock reduction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      for (const itemDto of items) {
        const product = await queryRunner.manager.findOneBy(Product, {
          id: itemDto.productId,
        });

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${itemDto.productId} not found`,
          );
        }

        if (product.stock < itemDto.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.name}`,
          );
        }

        // Reduce stock
        product.stock -= itemDto.quantity;
        await queryRunner.manager.save(product);

        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.quantity = itemDto.quantity;
        orderItem.unitPrice = product.price;
        
        totalAmount += Number(product.price) * itemDto.quantity;
        orderItems.push(orderItem);
      }

      const order = new Order();
      order.customerId = customerId;
      order.totalAmount = totalAmount;
      order.status = OrderStatus.PENDING;
      order.items = orderItems;

      const savedOrder = await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();

      // Emit RabbitMQ event
      this.client.emit('order_placed', {
        orderId: savedOrder.id,
        customerId: savedOrder.customerId,
        totalAmount: savedOrder.totalAmount,
        items: savedOrder.items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });

      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}

