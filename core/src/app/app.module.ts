import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from "@nestjs/core";

// VALIDATION
import * as Joi from 'joi';

// CONFIG FILES
import databaseConfig from "../config/database.config";
import securityConfig from "../config/security.config";

// GUARDS
import { AuthGuard } from "../security/guards/auth.guard";
import { RolesGuard } from "../security/guards/roles.guard";

// OTHER RESOURCE
import { DatabaseModule } from "../database/database.module";
import { AuthModule } from "../security/auth/auth.module";
import { UsersModule } from "../modules/users/users.module";
import { StripeModule } from "../providers/stripe/stripe.module";
import { StudioModule } from "../modules/studio/studio.module";


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [],
      isGlobal: true,
      load: [databaseConfig, securityConfig],
      validationSchema: Joi.object({
        // BASIC SERVER VALIDATION
        SERVER_ENV: Joi.string()
          .required()
          .valid('development', 'production', 'test')
          .default('development'),
        SERVER_DOMAIN: Joi.string().required(),
        SERVER_PORT: Joi.number().required(),
        // MAIN VALIDATION
        ALLOWED_ORIGINS_URL: Joi.string().required(),
        ALLOWED_ORIGINS_LOCAL: Joi.string().required(),
        // DATABASE VALIDATION
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_DEV_DB: Joi.string().required(),
        // SECURE VALIDATION
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        // PAYMENT VALIDATION
        STRIPE_SECRET_KEY: Joi.string().required(),
        STRIPE_PUBLIC_KEY: Joi.string().required(),
        TEST_STRIPE_SECRET_KEY: Joi.string().required(),
        TEST_STRIPE_PUBLIC_KEY: Joi.string().required(),
        // SMTP VALIDATION
        SMTP_HOST: Joi.string().required(),
        SMTP_PORT: Joi.number().required(),
        SMTP_USERNAME: Joi.string().required(),
        SMTP_PASSWORD: Joi.string().required(),
        SMTP_SECURE: Joi.string().required(),
        SMTP_TLS: Joi.string().required(),
        //DISCORD VALIDATION
        DISCORD_CLIENT_ID: Joi.string().required(),
        DISCORD_CLIENT_SECRET: Joi.string().required(),
        DISCORD_REDIRECT_URI: Joi.string().required(),
        // GOOGLE VALIDATION
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_REDIRECT_URI: Joi.string().required(),
        // TWITCH VALIDATION
        TWITCH_CLIENT_ID: Joi.string().required(),
        TWITCH_CLIENT_SECRET: Joi.string().required(),
        TWITCH_REDIRECT_URI: Joi.string().required(),
        // TWITTER VALIDATION
        TWITTER_CLIENT_ID: Joi.string().required(),
        TWITTER_CLIENT_SECRET: Joi.string().required(),
        TWITTER_REDIRECT_URI: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    StripeModule,
    StudioModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
