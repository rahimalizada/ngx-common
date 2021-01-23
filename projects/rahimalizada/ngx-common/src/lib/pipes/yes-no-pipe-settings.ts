import { InjectionToken } from '@angular/core';

export const YES_NO_PIPE_SETTINGS = new InjectionToken<YesNoPipeSettings>(
  'Yes-No pipe settings'
);

export interface YesNoPipeSettings {
  yes?: string;
  no?: string;
}
