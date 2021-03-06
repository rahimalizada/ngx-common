import { KeyValue } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { reloadPage } from '../../helpers/reload-page.helper';
import { StatusUpdate } from '../../model/status-update/status-update.model';
import { GenericEnumSort } from './../../helpers/enum-sort';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Status = any;
type StatusSpec = { title: string; description: string; textClass: string };
type StatusData = Map<Status, StatusSpec>;
type StatusSort = (a: KeyValue<string, Status>, b: KeyValue<string, Status>) => number;
type Method = (statusUpdate: StatusUpdate<Status>) => Observable<void>;
type NotificationService = { info(value: string): void; error(value: string): void };

@Component({
  selector: 'lib-status-edit[accountId][status][statusData][method]',
  templateUrl: './status-edit.component.html',
  styleUrls: ['./status-edit.component.scss'],
})
export class StatusEditComponent {
  @Input()
  accountId!: string;

  @Input()
  status!: Status;

  @Input()
  statusData!: StatusData;

  @Input()
  statusSort: StatusSort = GenericEnumSort;

  @Input()
  method!: Method;

  @Input()
  notificationService?: NotificationService;

  @Input()
  successNotification?: string;

  statusNotes?: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  getTitle(statusSpec: unknown): string {
    return (statusSpec as StatusSpec).title;
  }

  updateStatus(): void {
    this.method({ accountId: this.accountId, status: this.status, notes: this.statusNotes, created: new Date() }).subscribe(
      () => {
        reloadPage(this.router, this.activatedRoute);
        this.notificationService?.info(this.successNotification || 'Status has been updated');
      },
      (err) => this.notificationService?.error(err),
    );
  }
}
