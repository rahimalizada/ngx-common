import { Inject, Optional, Pipe, PipeTransform } from '@angular/core';
import {
  YesNoPipeSettings,
  YES_NO_PIPE_SETTINGS,
} from './yes-no-pipe-settings';

@Pipe({
  name: 'yesNo',
})
export class YesNoPipe implements PipeTransform {
  private yes = 'yes';
  private no = 'no';

  constructor(
    @Optional() @Inject(YES_NO_PIPE_SETTINGS) settings?: YesNoPipeSettings
  ) {
    if (settings) {
      this.yes = settings.yes ?? 'yes';
      this.no = settings.no ?? 'no';
    }
  }
  transform(value: any, yes?: string, no?: string): any {
    return value ? yes ?? this.yes : no ?? this.no;
  }
}
