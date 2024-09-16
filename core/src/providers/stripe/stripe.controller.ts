import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Stripe Gateway')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('charge')
  async createCharge(
    @Body()
    chargeRequest: {
      amount: number;
      currency: string;
      source: string;
      description: string;
      billingId: string; // Add billingId to the request body
    },
  ) {
    return this.stripeService.createChargeAndInvoice(
      chargeRequest.amount,
      chargeRequest.currency,
      chargeRequest.source,
      chargeRequest.description,
      chargeRequest.billingId,
    );
  }

  @Post('customer')
  async createCustomer(
    @Body() customerRequest: { email: string; name: string; source: string },
  ) {
    return this.stripeService.createCustomer(
      customerRequest.email,
      customerRequest.name,
      customerRequest.source,
    );
  }

  @Post('subscription')
  async createSubscription(
    @Body() subscriptionRequest: { customerId: string; planId: string },
  ) {
    return this.stripeService.createSubscription(
      subscriptionRequest.customerId,
      subscriptionRequest.planId,
    );
  }
}
