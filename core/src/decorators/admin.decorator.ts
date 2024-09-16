// src/decorators/admin-only.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_ADMIN_KEY = 'isAdmin';
export const AdminOnly = () => SetMetadata(IS_ADMIN_KEY, true);

// TODO: Not working as intended and allowing who is set to false to delete users
