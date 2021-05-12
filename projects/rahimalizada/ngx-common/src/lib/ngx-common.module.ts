import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusEditComponent } from './component/status-edit/status-edit.component';
import { StatusListComponent } from './component/status-list/status-list.component';
import { ProgressIndicatorDirective } from './directives/progress-indicator.directive';
import { ProgressIndicatorInterceptor } from './interceptors/progress-indicator.interceptor';
import { PwaLaunchModeInterceptor } from './interceptors/pwa-launch-mode.interceptor';
import { SafePipe } from './pipes/safe.pipe';
import { ValueOrDashPipe } from './pipes/value-or-dash.pipe';
import { YesNoPipe } from './pipes/yes-no.pipe';
import { DateParserInterceptor } from './rest/date-parser.interceptor';

@NgModule({
  declarations: [YesNoPipe, ValueOrDashPipe, SafePipe, ProgressIndicatorDirective, StatusEditComponent, StatusListComponent],
  imports: [HttpClientModule, FormsModule, ReactiveFormsModule],
  exports: [YesNoPipe, ValueOrDashPipe, SafePipe, ProgressIndicatorDirective],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DateParserInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PwaLaunchModeInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: ProgressIndicatorInterceptor,
      multi: true,
    },
  ],
})
export class NgxCommonModule {}
