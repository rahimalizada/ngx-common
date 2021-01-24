import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractRestService, AuthResult } from '@rahimalizada/ngx-common';
import { BackendAccount } from './backend-account.model';

@Injectable({
  providedIn: 'root',
})
export class BackendAccountService extends AbstractRestService<BackendAccount> {
  constructor(httpClient: HttpClient) {
    super(httpClient, '/api/account');
  }

  changePassword(value: { currentPassword: string; newPassword: string }) {
    return this.httpClient.post<AuthResult<BackendAccount, string>>(`${this.basePath}/password`, value);
  }
}
