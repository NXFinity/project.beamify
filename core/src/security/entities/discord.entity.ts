import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../database/base/base.entity';
import { User } from 'src/database/entities/user/user.entity';

@Entity('discord')
export class Discord extends BaseEntity {
  @Column('varchar', { name: 'discordId', length: 255 })
  discordId: string;
  @Column('varchar', { name: 'username', length: 255 })
  username: string;
  @Column('varchar', { name: 'discriminator', length: 255 })
  discriminator: string;
  @Column('varchar', { name: 'avatar', length: 255 })
  avatar: string;
  @Column('varchar', { name: 'email', length: 255 })
  email: string;
  @Column('varchar', { name: 'accessToken', length: 255 })
  accessToken: string;
  @Column('varchar', { name: 'refreshToken', length: 255 })
  refreshToken: string;
  @Column('boolean', { name: 'isConnected' })
  isConnected: boolean;

  @Column('varchar', { name: 'discordToken', length: 255 })
  discordToken: string;

  @Column('boolean', { name: 'isConnection' })
  isConnection: boolean;

  @OneToOne(() => User, (user) => user.discord)
  @JoinColumn()
  user: User;
}
