import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Laptop',
    minLength: 1,
  })
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString({ message: 'Product name must be a string' })
  name: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'High-performance laptop with 16GB RAM',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    description: 'Product price',
    example: 999.99,
    minimum: 0.01,
    maximum: 999999.99,
  })
  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0.01, { message: 'Price must be greater than 0' })
  @Max(999999.99, { message: 'Price must be less than 1,000,000' })
  price: number;

  @ApiProperty({
    description: 'Product stock quantity',
    example: 50,
    minimum: 0,
  })
  @IsNotEmpty({ message: 'Stock is required' })
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock cannot be negative' })
  stock: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

