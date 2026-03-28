export interface JwtPayload {
  userId: number;
  userCode: string;
  groupCode: string;

  // RBAC related
  roles?: string[];
  permissions?: string[];

  // optional metadata
  iat?: number;
  exp?: number;
}