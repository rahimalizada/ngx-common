import { Component, Input } from '@angular/core';
import { StatusUpdate } from '../../model/status-update/status-update.model';

type Status = unknown;
type StatusSpec = { title: string; description: string; textClass: string };
type StatusData = { get(status: Status): StatusSpec };

@Component({
  selector: 'lib-status-list[statusUpdates][statusData]',
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.scss'],
})
export class StatusListComponent {
  @Input()
  statusUpdates!: StatusUpdate<Status>[];

  @Input()
  statusData!: StatusData;

  @Input()
  showAccountId = true;
}
