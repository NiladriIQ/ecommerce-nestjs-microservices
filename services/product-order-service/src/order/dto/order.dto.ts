import {
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  IsNotEmpty,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: 1,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsInt({ message: 'Product ID must be an integer' })
  @Min(1, { message: 'Product ID must be greater than 0' })
  productId: number;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'Quantity is required' })
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Customer ID',
    example: 1,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'Customer ID is required' })
  @IsInt({ message: 'Customer ID must be an integer' })
  @Min(1, { message: 'Customer ID must be greater than 0' })
  customerId: number;

  @ApiProperty({
    description: 'List of order items',
    type: [CreateOrderItemDto],
    example: [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 },
    ],
  })
  @IsNotEmpty({ message: 'Order items are required' })
  @IsArray({ message: 'Items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

