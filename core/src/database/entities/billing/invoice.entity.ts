import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { Billing } from './billing.entity';

@Entity('invoices')
export class Invoice extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  chargeId: string;
  @Column({ type: 'int' })
  amount: number;
  @Column({ type: 'varchar', length: 3 })
  currency: string;
  @Column({ type: 'text' })
  description: string;
  @Column({ type: 'varchar', length: 50 })
  status: string;
  @ManyToOne(() => Billing, (billing) => billing.invoices)
  @JoinColumn()
  billing: Billing;
}
