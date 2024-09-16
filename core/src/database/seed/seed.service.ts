import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../api/users/users.service';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { Role } from 'src/security/roles/roles.enum';
import * as crypto from 'crypto';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedAccounts();
    await this.seedUserAccounts();
  }

  private async seedAccounts() {
    const systemUsername = this.configService.get<string>('SYSTEM_USERNAME');
    const systemEmail = this.configService.get<string>('SYSTEM_EMAIL');
    const plainPassword = this.configService.get<string>('SYSTEM_PASSWORD');
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Define the System_Administrator role
    const systemAdministratorRole = [Role.System_Administrator];

    // Check and create system account
    const systemExists = await this.usersService.findByEmail(systemEmail);
    if (!systemExists) {
      await this.usersService.create({
        username: systemUsername,
        email: systemEmail,
        password: hashedPassword,
        isVerified: true,
        isAdmin: true,
        role: Role.System_Administrator, // Assign System_Administrator role
      });
      this.logger.log('System account created successfully.');
    } else {
      this.logger.log('System account already exists.');
    }

    // Check and create systemAdmin account
    const systemAdminEmail = `admin@${systemEmail.split('@')[1]}`;
    const systemAdminExists =
      await this.usersService.findByEmail(systemAdminEmail);
    if (!systemAdminExists) {
      await this.usersService.create({
        username: `${systemUsername}Admin`,
        email: systemAdminEmail,
        password: hashedPassword,
        isVerified: true,
        isAdmin: true,
        role: Role.System_Administrator, // Assign System_Administrator role
      });
      this.logger.log('SystemAdmin account created successfully.');
    } else {
      this.logger.log('SystemAdmin account already exists.');
    }
  }

  async seedUserAccounts() {
    const userAccountsPath = path.join(
      __dirname,
      './database/seed/userAccounts.json',
    );
    const userAccountsData = fs.readFileSync(userAccountsPath, 'utf8');
    const userAccounts = JSON.parse(userAccountsData);

    for (const account of userAccounts) {
      const hashedPassword = await bcrypt.hash(account.password, 10);
      const userExists = await this.usersService.findByEmail(account.email);
      if (!userExists) {
        await this.usersService.create({
          username: account.username,
          email: account.email,
          password: hashedPassword,
          isVerified: false,
          isAdmin: false,
          isReserved: true,
          verifyToken: this.generateVerificationToken(),
        });
        this.logger.log(
          `User account ${account.username} created successfully.`,
        );
      } else {
        this.logger.log(`User account ${account.username} already exists.`);
      }
    }
  }

  generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }
}
