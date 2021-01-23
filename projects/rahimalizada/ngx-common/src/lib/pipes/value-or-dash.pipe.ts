import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'valueOrDash',
})
export class ValueOrDashPipe implements PipeTransform {
  transform(value: any, suffix?: string): any {
    return value == null ? '-' : suffix ? value + suffix : value;
  }
}
