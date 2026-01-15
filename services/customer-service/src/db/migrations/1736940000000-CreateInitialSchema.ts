import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1736940000000 implements MigrationInterface {
  name = 'CreateInitialSchema1736940000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create customers table if not exists
    const customersTableExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'customers'
    `);
    
    if (customersTableExists.length === 0) {
      await queryRunner.query(`
        CREATE TABLE "customers" (
          "id" SERIAL NOT NULL,
          "name" VARCHAR(255) NOT NULL,
          "email" VARCHAR(255) NOT NULL,
          "phone" VARCHAR(255),
          "address" TEXT,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          "deletedAt" TIMESTAMP,
          CONSTRAINT "PK_customers" PRIMARY KEY ("id"),
          CONSTRAINT "UQ_customers_email" UNIQUE ("email")
        )
      `);
    }

    // Create order_history table if not exists
    const orderHistoryTableExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'order_history'
    `);
    
    if (orderHistoryTableExists.length === 0) {
      await queryRunner.query(`
        CREATE TABLE "order_history" (
          "id" SERIAL NOT NULL,
          "orderId" INTEGER NOT NULL,
          "totalAmount" DECIMAL(10,2) NOT NULL,
          "items" JSONB NOT NULL,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          "customerId" INTEGER,
          CONSTRAINT "PK_order_history" PRIMARY KEY ("id")
        )
      `);
    }

    // Add foreign key if it doesn't exist
    const fkCustomerExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'FK_order_history_customer'
    `);
    
    if (fkCustomerExists.length === 0) {
      await queryRunner.query(`
        ALTER TABLE "order_history"
        ADD CONSTRAINT "FK_order_history_customer" 
        FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key
    await queryRunner.query(`
      ALTER TABLE "order_history" DROP CONSTRAINT "FK_order_history_customer"
    `);

    // Drop tables
    await queryRunner.query(`DROP TABLE "order_history"`);
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}

