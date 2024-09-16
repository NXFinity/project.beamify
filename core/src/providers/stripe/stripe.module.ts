import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from '../../database/entities/billing/invoice.entity';
import { Billing } from 'src/database/entities/billing/billing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Billing, Invoice])],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
