import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
const Strategy = require('passport-twitch').Strategy; // Use require instead of import

@Injectable()
export class TwitchStrategy extends PassportStrategy(Strategy, 'twitch') {
  constructor() {
    super({
      clientID: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      callbackURL: process.env.TWITCH_CALLBACK_URL,
      scope: ['user:read:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      accessToken,
      refreshToken,
      profile,
    };
  }
}
