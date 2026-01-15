import * as Joi from 'joi';

export default Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'staging')
        .default('development'),
    APP_ENV: Joi.string()
        .valid('dev', 'qa', 'staging', 'production', 'development', 'test')
        .optional(),
    PORT: Joi.number().port().default(3001),
    HOST: Joi.string().default('0.0.0.0'),
    DB_TYPE: Joi.string().valid('postgres', 'mysql', 'sqlite', 'mongodb').required(),
    DB_HOST: Joi.string().hostname().required(),
    DB_PORT: Joi.number().port().default(5432),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_SYNC: Joi.boolean().default(false),
    AUTO_LOAD: Joi.boolean().default(false),
    // JWT_SECRET: Joi.string().required(),
    // JWT_EXPIRES_IN: Joi.string().required(),
    RABBITMQ_URL: Joi.string().uri().required(),
})