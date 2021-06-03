import { PagerPathProvider } from './pager-path-provider.model';

export class PagerPathProviders {
  public static default: PagerPathProvider = {
    getPagerPath() {
      return undefined;
    },
  };

  public static withUserId(userId?: string): PagerPathProvider {
    return PagerPathProviders.withPath('user', userId);
  }

  public static withPath(path: string, value?: string): PagerPathProvider {
    return {
      getPagerPath() {
        return value ? `${path}/${value}` : undefined;
      },
    };
  }
}
