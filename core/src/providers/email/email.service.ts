import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { UsersService } from 'src/api/users/users.service';
require('dotenv').config();
import * as path from 'path';
import { User } from 'src/database/entities/user/user.entity';
import { Verification } from './templates/verification';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(
    private usersService: UsersService,
    private verificationEmailService: Verification,
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(user: User) {
    const verificationToken = this.generateVerificationToken();

    // Save the verification token to the user entity
    user.verifyToken = verificationToken;
    await this.usersService.usersRepository.save(user);

    const url = `${process.env.SERVER_DOMAIN}/verify?token=${verificationToken}`;

    // Use the VerificationEmailService to get the email HTML
    const emailHtml =
      this.verificationEmailService.getVerificationEmailTemplate(
        user,
        url,
        verificationToken,
      );

    const mailOptions = {
      from: '"BEAMIFY ME" <' + process.env.SMTP_USERNAME + '>',
      to: user.email,
      subject: 'Account Verification',
      html: emailHtml, // Use the rendered HTML as the email content
      attachments: [
        {
          filename: 'beamify.png',
          path: path.join(__dirname, 'assets/beamify.png'),
          cid: 'beamifyLogo', //same cid value as in the html img src
        },
      ],
    };
    return this.transporter.sendMail(mailOptions);
  }

  generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }
}
