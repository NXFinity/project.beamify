import { SetMetadata } from '@nestjs/common';

export const IS_DEVELOPER_KEY = 'isDeveloper';
export const IsDeveloper = () => SetMetadata(IS_DEVELOPER_KEY, true);
