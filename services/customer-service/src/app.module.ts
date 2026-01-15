import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig, dbConfig, envValidator, getEnvFilePaths } from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';

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
      useFactory: (configService: ConfigService) => ({
        ...configService.get('db'),
        // autoLoadEntities handles entity discovery automatically
        // No need to manually specify entity paths
      }),
    }),
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
