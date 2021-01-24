import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProgressIndicatorInterceptor } from '../interceptors/progress-indicator.interceptor';

export type IndicatorType = 'navigation' | 'http' | 'both';

@Directive({
  selector: '[ngProgressIndicator]',
})
export class ProgressIndicatorDirective implements OnDestroy {
  private subscription!: Subscription;
  private hasView = false;
  private showNavigation = false;
  private showHttp = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private router: Router,
    private progressIndicatorInterceptor: ProgressIndicatorInterceptor,
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @Input()
  set ngProgressIndicator(type: IndicatorType) {
    if (type === 'http' || type === 'both') {
      this.subscription = this.progressIndicatorInterceptor.progressSubject.subscribe((val) => {
        this.showHttp = val > 0;
        Promise.resolve(null).then(() => this.redraw());
      });
    }

    if (type === 'navigation' || type === 'both') {
      this.router.events.subscribe((evt: Event) => {
        switch (true) {
          case evt instanceof NavigationStart: {
            this.showNavigation = true;
            this.redraw();
            break;
          }
          case evt instanceof NavigationEnd:
          case evt instanceof NavigationCancel:
          case evt instanceof NavigationError: {
            this.showNavigation = false;
            this.redraw();
            break;
          }
          default: {
            break;
          }
        }
      });
    }
  }

  redraw() {
    if (!this.hasView && (this.showNavigation || this.showHttp)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (this.hasView && !this.showNavigation && !this.showHttp) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
