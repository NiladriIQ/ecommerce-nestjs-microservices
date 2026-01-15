import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';
import { Order } from './order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all orders',
    type: [Order],
  })
  async findAll(): Promise<Order[]> {
    return await this.orderService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Order ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order found',
    type: Order,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return await this.orderService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Order created successfully',
    type: Order,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or insufficient stock',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product or customer not found',
  })
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.orderService.create(createOrderDto);
  }
}

