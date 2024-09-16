import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Billing } from 'src/database/entities/billing/billing.entity';
import { Repository } from 'typeorm';
import { Invoice } from 'src/database/entities/billing/invoice.entity';
const chalk = require('chalk');

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Billing) public billingRepository: Repository<Billing>,
    @InjectRepository(Invoice) public invoiceRepository: Repository<Invoice>,
    private configService: ConfigService,
  ) {
    const isProduction = this.configService.get('SERVER_ENV') === 'production';
    const stripeSecretKey = isProduction
      ? this.configService.get('STRIPE_SECRET_KEY')
      : this.configService.get('TEST_STRIPE_SECRET_KEY');

    // Log which key is being used
    console.log(
      chalk.blueBright(
        `Using ${isProduction ? 'production' : 'test'} Stripe key.`,
      ),
    );

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });
  }

  async createChargeAndInvoice(
    amount: number,
    currency: string,
    source: string,
    description: string,
    billingId: string, // Assuming you pass the billing entity's ID to link the invoice
  ): Promise<Stripe.Response<Stripe.Charge>> {
    // First, create the charge using Stripe
    const charge = await this.stripe.charges.create({
      amount,
      currency,
      source,
      description,
    });

    // Assuming you have a method to find a billing entity by ID
    const billing = await this.billingRepository.findOne({
      where: { id: billingId },
    });

    if (!billing) {
      throw new Error('Billing entity not found');
    }

    // Create the invoice entity and link it to the billing entity
    const invoice = this.invoiceRepository.create({
      // Set properties of the invoice, including linking to the billing entity
      billing: billing,
      // You might want to include other properties like amount, currency, etc., based on your Invoice entity definition
    });

    // Save the invoice entity to the database
    await this.invoiceRepository.save(invoice);

    // Return the created charge
    return charge;
  }

  async createCustomer(
    email: string,
    name: string,
    source: string,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    return this.stripe.customers.create({
      email,
      name,
      source,
    });
  }

  async createSubscription(
    customerId: string,
    planId: string,
  ): Promise<Stripe.Response<Stripe.Subscription>> {
    return this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: planId }],
    });
  }
}
