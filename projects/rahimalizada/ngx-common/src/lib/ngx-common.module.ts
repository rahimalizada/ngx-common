import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { SafePipe } from './pipes/safe.pipe';
import { ValueOrDashPipe } from './pipes/value-or-dash.pipe';
import { YesNoPipe } from './pipes/yes-no.pipe';
import { DateParserInterceptor } from './rest/date-parser.interceptor';

@NgModule({
  declarations: [YesNoPipe, ValueOrDashPipe, SafePipe],
  imports: [HttpClientModule],
  exports: [YesNoPipe, ValueOrDashPipe, SafePipe],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DateParserInterceptor,
      multi: true,
    },
  ],
})
export class NgxCommonModule {}
