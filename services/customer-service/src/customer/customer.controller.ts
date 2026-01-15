import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CustomerService } from './customer.service';
import { OrderHistoryService } from './order-history.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { Customer } from './customer.entity';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly orderHistoryService: OrderHistoryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all customers',
    type: [Customer],
  })
  async findAll(): Promise<Customer[]> {
    return await this.customerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Customer ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customer found',
    type: Customer,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
    return await this.customerService.findOne(id);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get order history for a customer' })
  @ApiParam({ name: 'id', type: 'number', description: 'Customer ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order history retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer not found',
  })
  async getHistory(@Param('id', ParseIntPipe) id: number) {
    return await this.orderHistoryService.getCustomerHistory(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Customer created successfully',
    type: Customer,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or email already exists',
  })
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return await this.customerService.create(createCustomerDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiParam({ name: 'id', type: 'number', description: 'Customer ID' })
  @ApiBody({ type: UpdateCustomerDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customer updated successfully',
    type: Customer,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return await this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiParam({ name: 'id', type: 'number', description: 'Customer ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Customer deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer not found',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.customerService.remove(id);
  }

  @EventPattern('order_placed')
  async handleOrderPlaced(@Payload() data: any) {
    await this.orderHistoryService.createHistory(data);
  }
}

