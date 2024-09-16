import { BaseEntity } from 'src/database/base/base.entity';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('social')
export class Social extends BaseEntity {
  twitter: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  onlyFans: string;
  reddit: string;
  fanly: string;
  twitch: string;
  youtube: string;
  trovo: string;
  kick: string;
  discord: string;
  steam: string;
  epic: string;
  battleNet: string;
  psn: string;
  xbox: string;
  nintendo: string;
  origin: string;
  snapchat: string;
  tiktok: string;
  whatsapp: string;
  @OneToOne(() => User, (user) => user.social)
  @JoinColumn()
  user: User;
}
