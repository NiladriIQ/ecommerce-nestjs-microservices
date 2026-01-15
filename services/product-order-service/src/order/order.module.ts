import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../product/product.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
    ClientsModule.registerAsync([
      {
        name: 'ORDER_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('appConfig.rabbitmqUrl')],
            queue: 'customer_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}

