import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { Profile } from './profile.entity';
import { Role } from 'src/security/roles/roles.enum';
import { Billing } from '../billing/billing.entity';
import { Social } from './social.entity';
import { Posts } from '../post/posts.entity';
import { Studio } from '../studio/studio.entity';
import { Discord } from 'src/security/entities/discord.entity';

@Entity('users')
export class User extends BaseEntity {
  // BASIC USER VALUES
  @Column({ unique: true })
  username: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;

  // USER ROLES & PERMISSIONS
  @Column('simple-array', { nullable: true, default: [Role.Member] })
  roles: string[];

  // USER VERIFICATION
  @Column({ nullable: true })
  verifyToken?: string;
  @Column({ default: false })
  isVerified: boolean;

  // USER SUPPORT
  @Column({ default: false })
  isVIP: boolean;
  @Column({ default: false })
  isPremium: boolean;

  // SYSTEM ROLES
  @Column({ default: false })
  isAdmin: boolean;
  @Column({ default: false })
  isStaff: boolean;

  // DEVELOPER VERIFICATION
  @Column({ default: false })
  isDeveloper: boolean;
  @Column({ nullable: true })
  developerToken: string;

  // USER ROLES
  @Column({ default: false })
  isTeamLeader: boolean;
  @Column({ default: false })
  isReserved: boolean;

  // ONE-TO-ONE RELATIONSHIPS
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
  @OneToOne(() => Billing, (billing) => billing.user)
  billing: Billing;
  @OneToOne(() => Social, (social) => social.user)
  social: Social;
  @OneToOne(() => Studio, (studio) => studio.user)
  studio: Studio;

  // ONE-TO-MANY RELATIONSHIPS
  @OneToMany(() => Posts, (posts) => posts.user)
  posts: Posts[];
  @OneToMany(() => Discord, (discord) => discord.user)
  discord: Discord;

  // MANY-TO-MANY RELATIONSHIPS
}
