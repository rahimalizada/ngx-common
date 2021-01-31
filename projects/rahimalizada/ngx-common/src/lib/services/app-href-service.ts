import { DOCUMENT, LocationStrategy } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppHrefService {
  public appOrigin: string;
  public appBaseHref: string;

  constructor(@Inject(DOCUMENT) private document: Document, private locationStrategy: LocationStrategy) {
    this.appOrigin = this.document.location.origin;

    const base = this.locationStrategy.getBaseHref() === this.document.location.origin ? '/' : this.document.location.origin;
    this.appBaseHref = new URL(base, this.document.location.origin).href;
  }
}
