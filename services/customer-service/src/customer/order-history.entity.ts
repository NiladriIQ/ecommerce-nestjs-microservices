import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from '../customer/customer.entity';

@Entity({ name: 'order_history' })
export class OrderHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  orderId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'jsonb' })
  items: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Customer, { onDelete: 'CASCADE' })
  customer: Customer;
}

