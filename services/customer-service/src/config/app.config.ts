import { registerAs } from "@nestjs/config";


export default registerAs('appConfig', () => ({
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3002', 10),
    host: process.env.HOST || '0.0.0.0',
    rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
}));