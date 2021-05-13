import { AbstractAuthService } from './abstract-auth.service';

export class WithPermissionsCheck<T extends { token: string; refreshToken: string; permissions: string[] }> {
  constructor(protected authService: AbstractAuthService<T>) {}

  hasAllPermissions(...permissions: string[]): boolean {
    return this.authService.hasAllPermissions(...permissions);
  }

  hasAnyPermissions(...permissions: string[]): boolean {
    return this.authService.hasAnyPermissions(...permissions);
  }
}
