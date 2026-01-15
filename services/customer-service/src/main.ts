import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get('appConfig');
  const port = appConfig.port;
  const host = appConfig.host;

  /*<-------------------------------- Enable CORS -------------------------------->*/
  app.enableCors();

  /*<--------------------------- Global Validation Pipe -------------------------->*/
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are sent
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit type conversion
      },
      // disableErrorMessages: false, // Enable error messages in development
    }),
  );

  /*<--------------------------- RabbitMQ Microservice --------------------------->*/
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [appConfig.rabbitmqUrl],
      queue: 'customer_queue',
      queueOptions: {
        durable: false
      },
    },
  });

  await app.startAllMicroservices();

  /*<--------------------------- Swagger API Documentation ----------------------->*/
  const config = new DocumentBuilder()
    .setTitle('Customer Management Service API')
    .setDescription('REST API for managing customers and order history in the e-commerce system')
    .setVersion('1.0')
    .addTag('customers', 'Customer management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  logger.log(`Swagger documentation available at http://${host}:${port}/api`);

  /*<----------------------------- Listening to Server ----------------------------->*/
  await app.listen(port, host, () => {
    logger.log(`Customer Service is running on ${host}:${port}`);
  });
}
bootstrap();
