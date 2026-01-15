import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderHistory } from './order-history.entity';
import { Customer } from './customer.entity';

@Injectable()
export class OrderHistoryService {
  private readonly logger = new Logger(OrderHistoryService.name);

  constructor(
    @InjectRepository(OrderHistory)
    private readonly orderHistoryRepository: Repository<OrderHistory>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async createHistory(data: any): Promise<void> {
    this.logger.log(`Syncing order history for order ${data.orderId}`);

    const customer = await this.customerRepository.findOneBy({ id: data.customerId });
    if (!customer) {
      this.logger.error(`Customer with ID ${data.customerId} not found for order ${data.orderId}`);
      return;
    }

    const history = new OrderHistory();
    history.orderId = data.orderId;
    history.totalAmount = data.totalAmount;
    history.items = data.items;
    history.customer = customer;

    await this.orderHistoryRepository.save(history);
    this.logger.log(`Order history saved for order ${data.orderId}`);
  }

  async getCustomerHistory(customerId: number): Promise<OrderHistory[]> {
    return await this.orderHistoryRepository.find({
      where: { customer: { id: customerId } },
      order: { createdAt: 'DESC' },
    });
  }
}

