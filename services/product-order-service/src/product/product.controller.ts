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
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Product } from './product.entity';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all products',
    type: [Product],
  })
  async findAll(): Promise<Product[]> {
    return await this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Product ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product found',
    type: Product,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return await this.productService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully',
    type: Product,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productService.create(createProductDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', type: 'number', description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully',
    type: Product,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', type: 'number', description: 'Product ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Product deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.productService.remove(id);
  }
}

