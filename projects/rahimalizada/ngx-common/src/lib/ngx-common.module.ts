import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { DateParserInterceptor } from './rest/date-parser.interceptor';

@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  exports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DateParserInterceptor,
      multi: true,
    },
  ],
})
export class NgxCommonModule {}
