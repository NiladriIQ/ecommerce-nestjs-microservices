import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1736940000000 implements MigrationInterface {
  name = 'CreateInitialSchema1736940000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check and create OrderStatus enum if not exists
    const enumExists = await queryRunner.query(`
      SELECT 1 FROM pg_type WHERE typname = 'order_status_enum'
    `);
    
    if (enumExists.length === 0) {
      await queryRunner.query(`
        CREATE TYPE "order_status_enum" AS ENUM('PENDING', 'PAID', 'CANCELLED')
      `);
    }

    // Create products table if not exists
    const productsTableExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'products'
    `);
    
    if (productsTableExists.length === 0) {
      await queryRunner.query(`
        CREATE TABLE "products" (
          "id" SERIAL NOT NULL,
          "name" VARCHAR(255) NOT NULL,
          "description" TEXT,
          "price" DECIMAL(10,2) NOT NULL,
          "stock" INTEGER NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          "deletedAt" TIMESTAMP,
          CONSTRAINT "PK_products" PRIMARY KEY ("id")
        )
      `);
    }

    // Create orders table if not exists
    const ordersTableExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'orders'
    `);
    
    if (ordersTableExists.length === 0) {
      await queryRunner.query(`
        CREATE TABLE "orders" (
          "id" SERIAL NOT NULL,
          "customerId" INTEGER NOT NULL,
          "totalAmount" DECIMAL(10,2) NOT NULL,
          "status" "order_status_enum" NOT NULL DEFAULT 'PENDING',
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_orders" PRIMARY KEY ("id")
        )
      `);
    }

    // Create order_items table if not exists
    const orderItemsTableExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'order_items'
    `);
    
    if (orderItemsTableExists.length === 0) {
      await queryRunner.query(`
        CREATE TABLE "order_items" (
          "id" SERIAL NOT NULL,
          "quantity" INTEGER NOT NULL,
          "unitPrice" DECIMAL(10,2) NOT NULL,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          "orderId" INTEGER,
          "productId" INTEGER,
          CONSTRAINT "PK_order_items" PRIMARY KEY ("id")
        )
      `);
    }

    // Add foreign keys if they don't exist
    const fkOrderExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'FK_order_items_order'
    `);
    
    if (fkOrderExists.length === 0) {
      await queryRunner.query(`
        ALTER TABLE "order_items"
        ADD CONSTRAINT "FK_order_items_order" 
        FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      `);
    }

    const fkProductExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'FK_order_items_product'
    `);
    
    if (fkProductExists.length === 0) {
      await queryRunner.query(`
        ALTER TABLE "order_items"
        ADD CONSTRAINT "FK_order_items_product" 
        FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    await queryRunner.query(`
      ALTER TABLE "order_items" DROP CONSTRAINT "FK_order_items_product"
    `);
    await queryRunner.query(`
      ALTER TABLE "order_items" DROP CONSTRAINT "FK_order_items_order"
    `);

    // Drop tables
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "products"`);

    // Drop enum
    await queryRunner.query(`DROP TYPE "order_status_enum"`);
  }
}

