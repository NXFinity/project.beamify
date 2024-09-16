import { Entity } from 'typeorm';
import { BaseEntity } from '../../database/base/base.entity';

@Entity('twitter')
export class Twitter extends BaseEntity {
  twitterId: string;
  username: string;
  displayName: string;
  avatar: string;
  accessToken: string;
  tokenSecret: string;
  refreshToken: string;
}
