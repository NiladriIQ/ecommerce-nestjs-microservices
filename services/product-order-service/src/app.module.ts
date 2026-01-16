import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig, dbConfig, envValidator, getEnvFilePaths } from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePaths(), // Load multiple env files with precedence
      load: [appConfig, dbConfig],
      validationSchema: envValidator,
      expandVariables: true, // Enable variable expansion in .env files
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('db');
        if (!dbConfig) throw new Error('Database configuration not found. Please check your .env files.');
        return { ...dbConfig };
      },
    }),
    ProductModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
