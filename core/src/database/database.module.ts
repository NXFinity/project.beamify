import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const isProduction = config.get('SERVER_ENV') === 'production';
        const database = isProduction
          ? config.get('POSTGRES_DB')
          : config.get('POSTGRES_DEV_DB');

        return {
          type: 'postgres',
          host: config.get('POSTGRES_HOST'),
          port: config.get('POSTGRES_PORT'),
          username: config.get('POSTGRES_USER'),
          password: config.get('POSTGRES_PASSWORD'),
          database: database,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
  providers: [],
})
export class DatabaseModule {}
