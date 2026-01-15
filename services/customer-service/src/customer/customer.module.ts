import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { OrderHistory } from './order-history.entity';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { OrderHistoryService } from './order-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, OrderHistory])],
  providers: [CustomerService, OrderHistoryService],
  controllers: [CustomerController],
  exports: [CustomerService, OrderHistoryService],
})
export class CustomerModule {}

