import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

export interface PermissionConfig {
  pageId: number;
  formId: number;
  controlCode: string; // 'save', 'view', etc.
}

export const Permissions = (config: PermissionConfig) =>
  SetMetadata(PERMISSIONS_KEY, config);