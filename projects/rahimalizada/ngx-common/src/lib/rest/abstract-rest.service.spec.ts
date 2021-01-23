import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { PagerRequestFiltersType } from '../model/pager/pager-request-filters-type.enum';
import { PagerResult } from '../model/pager/pager-result.model';
import { AbstractRestService } from './abstract-rest.service';

class TestService<T> extends AbstractRestService<T> {}
const basePath = 'path';
let service: TestService<any>;
let httpClient: jasmine.SpyObj<HttpClient>;

const sharedSetup = () => {
  beforeEach(() => {
    httpClient = jasmine.createSpyObj('HttpRequest', ['get', 'put', 'post', 'patch', 'delete']);
    service = new TestService(httpClient, basePath);
  });
};

const buildResult = (data: any) => {
  const result =
    data == null
      ? new Observable((observer: Observer<void>) => {
          observer.next();
          observer.complete();
        })
      : new Observable((observer: Observer<any>) => {
          observer.next(data);
          observer.complete();
        });
  httpClient.get.and.returnValue(result);
  httpClient.put.and.returnValue(result);
  httpClient.post.and.returnValue(result);
  httpClient.patch.and.returnValue(result);
  httpClient.delete.and.returnValue(result);
};

describe('AbstractRestService', () => {
  sharedSetup();

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should submit GET request on getMany call', () => {
    buildResult(['1', '2']);
    service.getMany().subscribe((res) => expect(res).toEqual(['1', '2']));
    expect(httpClient.get).toHaveBeenCalledWith(basePath);
  });

  it('should submit GET request on getOne call', () => {
    buildResult('1');
    service.getOne().subscribe((res) => expect(res).toEqual('1'));
    expect(httpClient.get).toHaveBeenCalledWith(basePath);
  });

  it('should submit GET request on getOneByPath call', () => {
    buildResult('1');
    service.getOneByPath('id').subscribe((res) => expect(res).toEqual('1'));
    expect(httpClient.get).toHaveBeenCalledWith(`${basePath}/id`);
  });

  it('should submit PUT request on create call', () => {
    buildResult(null);
    service.putOne('1').subscribe((res) => expect(res).toEqual(undefined));
    expect(httpClient.put).toHaveBeenCalledWith(`${basePath}`, '1');
  });

  it('should submit POST request on update call', () => {
    buildResult(null);
    service.postOne('1').subscribe((res) => expect(res).toEqual(undefined));
    expect(httpClient.post).toHaveBeenCalledWith(`${basePath}`, '1');
  });

  it('should submit POST request on updateByPath call', () => {
    buildResult(null);
    service.postOneByPath('id', '1').subscribe((res) => expect(res).toEqual(undefined));
    expect(httpClient.post).toHaveBeenCalledWith(`${basePath}/id`, '1');
  });

  it('should submit PATCH request on patchByPath call', () => {
    buildResult(null);
    service.patchOneByPath('id', '1').subscribe((res) => expect(res).toEqual(undefined));
    expect(httpClient.patch).toHaveBeenCalledWith(`${basePath}/id`, '1');
  });

  it('should submit DELETE request on deleteByPath call', () => {
    buildResult(null);
    service.deleteByPath('id').subscribe((res) => expect(res).toEqual(undefined));
    expect(httpClient.delete).toHaveBeenCalledWith(`${basePath}/id`);
  });

  it('should submit GET request on pager call', () => {
    const result: PagerResult<string> = {
      page: 1,
      pageSize: 10,
      total: 30,
      hasMore: true,
      items: ['1', '2'],
    };
    buildResult(result);
    const requestFilters = {
      type: PagerRequestFiltersType.AND,
      userRatingFrom: 1,
    };
    service.pager(1, 10, 'id', 'asc', 'term1 term2', requestFilters).subscribe((res) => expect(res).toBe(result));

    const params = new HttpParams()
      .append('page', '1')
      .append('pageSize', '10')
      .append('sort', 'id')
      .append('sortDirection', 'asc')
      .append('searchTerms', 'term1')
      .append('searchTerms', 'term2')
      .append('requestFilters', JSON.stringify(requestFilters));
    expect(httpClient.get).toHaveBeenCalledWith(`${basePath}/pager`, { params });
  });

  it('should submit GET request on pager call without search terms', () => {
    const result: PagerResult<string> = {
      page: 1,
      pageSize: 10,
      total: 30,
      hasMore: true,
      items: ['1', '2'],
    };
    buildResult(result);
    const requestFilters = {
      type: PagerRequestFiltersType.AND,
      userRatingFrom: 1,
    };
    service.pager(1, 10, 'id', 'asc', undefined, requestFilters).subscribe((res) => expect(res).toBe(result));

    const params = new HttpParams()
      .append('page', '1')
      .append('pageSize', '10')
      .append('sort', 'id')
      .append('sortDirection', 'asc')
      .append('requestFilters', JSON.stringify(requestFilters));
    expect(httpClient.get).toHaveBeenCalledWith(`${basePath}/pager`, { params });
  });

  it('should submit GET request on pagerByPath call', () => {
    const result: PagerResult<string> = {
      page: 1,
      pageSize: 10,
      total: 30,
      hasMore: true,
      items: ['1', '2'],
    };
    buildResult(result);
    const requestFilters = {
      type: PagerRequestFiltersType.AND,
      userRatingFrom: 1,
    };
    service.pagerByPath('subpath', 1, 10, 'id', 'asc', '', null).subscribe((res) => expect(res).toBe(result));

    const params = new HttpParams().append('page', '1').append('pageSize', '10').append('sort', 'id').append('sortDirection', 'asc');
    expect(httpClient.get).toHaveBeenCalledWith(`${basePath}/pager/subpath`, {
      params,
    });
  });
});
