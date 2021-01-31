import { DOCUMENT, LocationStrategy } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

/** @dynamic */
@Injectable({
  providedIn: 'root',
})
export class AppHrefService {
  public appOrigin: string;
  public appBaseHref: string;

  constructor(locationStrategy: LocationStrategy, @Inject(DOCUMENT) document: Document) {
    this.appOrigin = document.location.origin;

    const base = locationStrategy.getBaseHref() === document.location.origin ? '/' : locationStrategy.getBaseHref();
    this.appBaseHref = new URL(base, document.location.origin).href;
  }
}
