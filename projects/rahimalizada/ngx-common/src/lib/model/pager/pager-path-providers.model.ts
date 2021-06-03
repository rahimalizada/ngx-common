import { PagerPathProvider } from './pager-path-provider.model';

export class PagerPathProviders {
  public static default(): PagerPathProvider {
    return { getPagerPath: () => undefined };
  }

  public static withUserId(userId: string): PagerPathProvider {
    return { getPagerPath: () => (userId ? `user/${userId}` : undefined) };
  }
}
