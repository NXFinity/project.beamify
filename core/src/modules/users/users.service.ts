import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../../database/entities/user/user.entity";
import {Profile} from "../../database/entities/user/profile.entity";
import {Social} from "../../database/entities/user/social.entity";
import {Billing} from "../../database/entities/billing/billing.entity";
import {Discord} from "../../security/entities/discord.entity";
import {StripeService} from "../../providers/stripe/stripe.service";
import {Role} from "../../security/roles/roles.enum";
import {createDirectory} from "../../functions/createDirectory.function";
import {UpdateUserDto} from "../../database/dto/createUser.dto";
import {StudioService} from "../studio/studio.service";


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public usersRepository: Repository<User>,
    @InjectRepository(Profile) private profilesRepository: Repository<Profile>,
    @InjectRepository(Social) private socialsRepository: Repository<Social>,
    @InjectRepository(Billing) private billingsRepository: Repository<Billing>,
    @InjectRepository(Discord) private discordRepository: Repository<Discord>,
    private stripeService: StripeService,
    private studioService: StudioService,
  ) {}

  // FIND ALL USERS || PUBLIC USER DATA
  async findAll() {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.studio', 'studio')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.isVerified',
        'user.isPremium',
        'user.isDeveloper',
        'user.isReserved',
        'user.isAdmin',
        'user.isStaff',
        'profile.id',
        'profile.avatar',
        'profile.cover',
        'profile.bio',
        'studio.isFeatured',
        'studio.isPrivate',
      ])
      .getMany();
  }

  // FIND ONE USER BY ID
  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['username', 'email', 'id', 'isAdmin'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  // FIND ONE USER BY EMAIL
  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // FIND ONE USER BY USERNAME
  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.studio', 'studio')
      .where('user.username = :username', { username })
      .select([
        'user.username',
        'user.email',
        'user.id',
        'studio.id',
        'studio.isLive',
        'studio.isFeatured',
        'studio.isPrivate',
        'profile.id',
        'profile.cover',
        'profile.avatar',
        'profile.bio',
        'profile.location',
      ])
      .getOne();

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // FIND ONE USER BY VERIFICATION TOKEN || USED IN EMAIL VERIFICATION
  async findByVerificationToken(verificationToken: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { verifyToken: verificationToken },
    });
  }

  // CREATE A NEW USER || UPDATE WHEN USER FIELDS ARE EXTENDED
  async create(user: {
    password: string;
    email: string;
    username: string;
    isVerified?: boolean;
    isAdmin?: boolean;
    isReserved?: boolean;
    role?: Role;
    verifyToken?: string;
  }): Promise<User> {
    const newUser = await this.usersRepository.save(user);

    user.isVerified = user.isVerified || false;
    user.isAdmin = user.isAdmin || false;
    user.isReserved = user.isReserved || false;

    // Create profile
    const profile = new Profile();
    profile.user = newUser;
    await this.profilesRepository.save(profile);

    // Create Billing
    const billing = new Billing();
    billing.user = newUser;
    await this.stripeService.billingRepository.save(billing);

    // Create Studio
    const studio = await this.studioService.create(newUser);
    studio.user = newUser;
    await this.studioService.studiosRepository.save(studio);

    // Create a directory for the user
    const isDirectoryCreated = createDirectory(newUser.id);

    if (isDirectoryCreated) {
    } else {
    }

    return newUser;
  }

  // UPDATE AN EXISTING USER
  async update(
    loggedInUser: User,
    user: User,
    updateData: UpdateUserDto,
  ): Promise<User> {
    if (loggedInUser.id !== user.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    // Fetch the user and their billing, profile, and studio information
    user = await this.usersRepository.findOne({
      where: { id: user.id },
      relations: ['billing', 'profile', 'studio', 'discord'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update the profile
    if (updateData.profile && user.profile) {
      const updatedProfile = {
        ...user.profile,
        ...updateData.profile,
      };
      await this.profilesRepository.update(user.profile.id, updatedProfile);
    }

    // Update the email in the User entity
    if (updateData.email) {
      await this.usersRepository.update(user.id, { email: updateData.email });
    }

    // Update the billing information
    if (updateData.billing && user.billing) {
      const updatedBilling = {
        ...user.billing,
        ...updateData.billing,
      };
      await this.billingsRepository.update(user.billing.id, updatedBilling);
    }

    // Update the studio information
    if (updateData.studio && user.studio) {
      const updatedStudio = {
        ...user.studio,
        ...updateData.studio,
      };
      await this.studioService.studiosRepository.update(
        user.studio.id,
        updatedStudio,
      );
    }

    if (updateData.discord && user.discord) {
      const updatedDiscord = {
        ...user.discord,
        ...updateData.discord,
      };
      await this.discordRepository.update(user.discord.id, updatedDiscord);
    }

    return await this.usersRepository.findOne({
      where: { id: user.id },
      relations: ['profile', 'billing', 'studio', 'discord'],
    });
  }

  // REMOVE A USER
  async remove(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile', 'billing', 'studio'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.profile) {
      await this.profilesRepository.delete(user.profile.id);
    }

    if (user.billing) {
      await this.billingsRepository.delete(user.billing.id);
    }

    if (user.studio) {
      await this.studioService.studiosRepository.delete(user.studio.id);
    }

    return this.usersRepository.delete(id);
  }

  // GET PROFILE OF A USER
  async getProfile(user: User) {
    return await this.usersRepository.findOne({
      where: { email: user.email },
      relations: ['profile', 'billing', 'studio'],
    });
  }
}

