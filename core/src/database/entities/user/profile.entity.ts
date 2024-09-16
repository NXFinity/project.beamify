import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { User } from './user.entity';

@Entity('profiles')
export class Profile extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string;
  @Column({ type: 'text', nullable: true })
  bio: string;
  @Column({
    nullable: false,
    default: 'https://i.postimg.cc/CMJnzmJ2/avatar.png',
  })
  avatar: string;
  @Column({
    nullable: false,
    default: 'https://i.postimg.cc/bwdpvvMW/cover.png',
  })
  cover: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;
  @Column({ nullable: true })
  dob: Date;
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;
}
