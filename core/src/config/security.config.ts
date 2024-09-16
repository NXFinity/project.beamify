import { registerAs } from '@nestjs/config';

export default registerAs('security', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
})); // This is the configuration for the Security module
