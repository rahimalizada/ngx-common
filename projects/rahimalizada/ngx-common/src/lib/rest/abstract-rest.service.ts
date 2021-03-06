import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagerResult } from '../model/pager/pager-result.model';

export abstract class AbstractRestService<T> {
  constructor(protected httpClient: HttpClient, protected basePath: string) {}

  buildParams(
    page: number,
    pageSize: number,
    sort: string,
    sortDirection: string,
    searchTerms?: string,
    requestFilters?: unknown,
  ): HttpParams {
    let params = new HttpParams()
      .append('page', page.toString())
      .append('pageSize', pageSize.toString())
      .append('sort', sort)
      .append('sortDirection', sortDirection);
    if (searchTerms != null) {
      for (const term of this.parseSearchTerms(searchTerms)) {
        params = params.append('searchTerms', term);
      }
    }
    if (requestFilters != null) {
      params = params.append('requestFilters', JSON.stringify(requestFilters));
    }
    return params;
  }

  pager(
    page: number,
    pageSize: number,
    sort: string,
    sortDirection: string,
    searchTerms?: string,
    requestFilters?: unknown,
  ): Observable<PagerResult<T>> {
    const params = this.buildParams(page, pageSize, sort, sortDirection, searchTerms, requestFilters);
    return this.httpClient.get<PagerResult<T>>(`${this.basePath}/pager`, { params });
  }

  pagerByPath(
    path: string,
    page: number,
    pageSize: number,
    sort: string,
    sortDirection: string,
    searchTerms?: string,
    requestFilters?: unknown,
  ): Observable<PagerResult<T>> {
    const params = this.buildParams(page, pageSize, sort, sortDirection, searchTerms, requestFilters);
    return this.httpClient.get<PagerResult<T>>(`${this.basePath}/pager/${path}`, {
      params,
    });
  }

  getOne(): Observable<T> {
    return this.httpClient.get<T>(this.basePath);
  }

  getMany(): Observable<T[]> {
    return this.httpClient.get<T[]>(this.basePath);
  }

  getOneByPath(path: string): Observable<T> {
    return this.httpClient.get<T>(`${this.basePath}/${path}`);
  }

  getManyByPath(path: string): Observable<T[]> {
    return this.httpClient.get<T[]>(`${this.basePath}/${path}`);
  }

  putOne(putData: T): Observable<void> {
    return this.httpClient.put<void>(this.basePath, putData);
  }

  putMany(putData: T[]): Observable<void>  {
    return this.httpClient.put<void>(this.basePath, putData);
  }

  putOneByPath(path: string, putData: T) : Observable<void> {
    return this.httpClient.put<void>(`${this.basePath}/${path}`, putData);
  }

  putManyByPath(path: string, putData: T[]): Observable<void>  {
    return this.httpClient.put<void>(`${this.basePath}/${path}`, putData);
  }

  postOne(postData: T): Observable<void>  {
    return this.httpClient.post<void>(this.basePath, postData);
  }

  postMany(postData: T[]): Observable<void>  {
    return this.httpClient.post<void>(this.basePath, postData);
  }

  postOneByPath(path: string, postData: T): Observable<void>  {
    return this.httpClient.post<void>(`${this.basePath}/${path}`, postData);
  }

  postManyByPath(path: string, postData: T[]): Observable<void>  {
    return this.httpClient.post<void>(`${this.basePath}/${path}`, postData);
  }

  patchOne(patchData: T): Observable<void>  {
    return this.httpClient.patch<void>(`${this.basePath}`, patchData);
  }

  patchMany(patchData: T[]): Observable<void>  {
    return this.httpClient.patch<void>(`${this.basePath}`, patchData);
  }

  patchOneByPath(path: string, patchData: T): Observable<void>  {
    return this.httpClient.patch<void>(`${this.basePath}/${path}`, patchData);
  }

  patchManyByPath(path: string, patchData: T[]): Observable<void>  {
    return this.httpClient.patch<void>(`${this.basePath}/${path}`, patchData);
  }

  deleteByPath(path: string): Observable<void>  {
    return this.httpClient.delete<void>(`${this.basePath}/${path}`);
  }

  private parseSearchTerms(termsString: string): string[] {
    if (!termsString) {
      return [];
    }
    return termsString
      .split(' ')
      .map((s) => s.trim() /* .toLowerCase()*/)
      .filter((s) => s.length > 0);
  }
}
