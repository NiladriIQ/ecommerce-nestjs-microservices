import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return await this.customerRepository.findOneBy({ email });
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const existing = await this.findByEmail(createCustomerDto.email);
    if (existing) {
      throw new ConflictException(`Customer with email ${createCustomerDto.email} already exists`);
    }
    const customer = this.customerRepository.create(createCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existing = await this.findByEmail(updateCustomerDto.email);
      if (existing) {
        throw new ConflictException(`Customer with email ${updateCustomerDto.email} already exists`);
      }
    }
    Object.assign(customer, updateCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
  }
}

