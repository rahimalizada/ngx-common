import { PagerPathProvider } from './pager-path-provider.model';

export class PagerPathProviders {
  public default: PagerPathProvider = { getPagerPath: () => undefined };

  public withUserId(userId: string): PagerPathProvider {
    return { getPagerPath: () => (userId ? `user/${userId}` : undefined) };
  }
}
