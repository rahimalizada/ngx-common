import { AbstractAuthService } from './abstract-auth.service';

export class WithPermissionsCheck<T extends { token: string; refreshToken: string; roles: string[] }> {
  constructor(protected authService: AbstractAuthService<T>) {}

  /**
   *
   * @param permissions  // Comma separated, AND
   * @returns
   */
  hasPermissions(permissions: string): boolean {
    return this.authService.hasPermissions(permissions);
  }
}
