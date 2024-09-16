import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { User } from '../user/user.entity';
import { Invoice } from './invoice.entity';

@Entity('billing')
export class Billing extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  billingAddress: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  contactEmail: string;
  @Column({ type: 'varchar', length: 20, nullable: true })
  contactPhone: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentMethod: string;
  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string;

  @OneToMany(() => Invoice, (invoice) => invoice.billing)
  invoices: Invoice[];

  @OneToOne(() => User, (user) => user.billing)
  @JoinColumn()
  user: User;
}
