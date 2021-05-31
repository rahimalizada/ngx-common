import { AfterViewInit, Directive, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, delay, distinctUntilChanged, startWith, switchMap, tap } from 'rxjs/operators';
import { AbstractRestService } from '../../rest/abstract-rest.service';
import { PagerResult } from './../../model/pager/pager-result.model';

@Directive()
export abstract class AbstractMatTableDirective<T> implements OnInit, OnDestroy, AfterViewInit {
  private static readonly DEFAULT_PAGE_SIZE = 10;

  @ViewChild(MatTable, { static: false }) private table!: MatTable<T>;
  @ViewChild(MatPaginator, { static: false }) private paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) private sort!: MatSort;

  pageSizeOptions = [5, 10, 25, 100, 200];
  currentPageSize?: number;

  pagerResult!: PagerResult<T>;
  isLoading = true;
  items: T[] = [];
  itemsSubject = new Subject<T[]>();

  public userId?: string;

  private searchTerms?: string;
  private searchTermsSubject = new Subject<string>();
  private requestFiltersSubject = new Subject<unknown>();
  private requestFilters: unknown;
  private subscription!: Subscription;

  constructor(protected service: AbstractRestService<T>, protected activatedRoute: ActivatedRoute, protected router: Router) {}

  loadData(
    page: number,
    pageSize: number,
    sort: string,
    sortDirection: string,
    searchTerms?: string,
    requestFilters?: unknown,
  ): Observable<PagerResult<T>> {
    const result = this.userId
      ? this.service.pagerByPath(`user/${this.userId}`, page, pageSize, sort, sortDirection, searchTerms, requestFilters)
      : this.service.pager(page, pageSize, sort, sortDirection, searchTerms, requestFilters);
    return result.pipe(
      tap((val) => {
        this.itemsSubject.next(val.items);
      }),
    );
  }

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.params.userId;
    this.loadPageSize();

    this.activatedRoute.queryParamMap
      .pipe(
        delay(0), // Required, bug
      )
      .subscribe((paramMap) => {
        const pageIndex = Number(paramMap.get('pageIndex'));
        if (this.paginator) {
          if (this.paginator.pageIndex !== pageIndex) {
            const obj = { previousPageIndex: pageIndex - 1, pageIndex, pageSize: this.paginator.pageSize, length: this.paginator.length };
            this.paginator.pageIndex = pageIndex;
            this.paginator.page.emit(obj);
          }
        }
      });
  }

  ngAfterViewInit(): void {
    this.reloadTable();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadPageSize(): void {
    if (this.currentPageSize) {
      return;
    }
    const loadedPageSize = Number(localStorage.getItem('pageSize'));
    this.currentPageSize = loadedPageSize ? loadedPageSize : AbstractMatTableDirective.DEFAULT_PAGE_SIZE;
  }

  savePageSize(pagesize: number): void {
    if (this.currentPageSize !== pagesize) {
      this.currentPageSize = pagesize;
      localStorage.setItem('pageSize', `${pagesize}`);
    }
  }

  onPageEvent(pageEvent: PageEvent): void {
    this.savePageSize(pageEvent.pageSize);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        pageIndex: pageEvent.pageIndex ? pageEvent.pageIndex : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  onRequestFiltersChange(requestFilters?: unknown): void {
    this.requestFilters = requestFilters;
    this.requestFiltersSubject.next(requestFilters);
  }

  onSearchTermsChange(searchTerms?: string): void {
    this.searchTerms = searchTerms;
    this.searchTermsSubject.next(searchTerms);
  }

  protected reloadTable(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    const observable: Observable<PagerResult<T>> = merge(
      this.sort?.sortChange.pipe(tap(() => this.paginator.firstPage())),
      this.searchTermsSubject.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => this.paginator.firstPage()),
      ),
      this.requestFiltersSubject.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => this.paginator.firstPage()),
      ),
      this.paginator.page.pipe(),
    ).pipe(
      startWith(null),
      switchMap(() => {
        this.isLoading = true;
        return this.loadData(
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.sort.active,
          this.sort.direction,
          this.searchTerms,
          this.requestFilters,
        );
      }),
      tap(() => (this.isLoading = false)),
      catchError(() => {
        this.isLoading = false;
        return of({} as PagerResult<T>);
      }),
    );

    this.subscription = observable.subscribe((data: PagerResult<T>) => {
      this.pagerResult = data;
      this.items = data.items;
    });

    // this.subscription = merge(
    //   this.sort?.sortChange.pipe(tap(() => this.paginator.firstPage())),
    //   this.searchTermsSubject.pipe(
    //     debounceTime(500),
    //     distinctUntilChanged(),
    //     tap(() => this.paginator.firstPage()),
    //   ),
    //   this.requestFiltersSubject.pipe(
    //     debounceTime(500),
    //     distinctUntilChanged(),
    //     tap(() => this.paginator.firstPage()),
    //   ),
    //   this.paginator.page.pipe(),
    // )
    //   .pipe(
    //     startWith(null),
    //     switchMap(() => {
    //       this.isLoading = true;
    //       return this.loadData(
    //         this.paginator.pageIndex,
    //         this.paginator.pageSize,
    //         this.sort.active,
    //         this.sort.direction,
    //         this.searchTerms,
    //         this.requestFilters,
    //       );
    //     }),
    //     tap(() => (this.isLoading = false)),
    //     catchError(() => {
    //       this.isLoading = false;
    //       return of([]);
    //     }),
    //   )
    //   .subscribe((data: PagerResult<T>) => {
    //     this.pagerResult = data;
    //     this.items = data.items;
    //   });
  }

  protected updateItem(index: number, item: T): void {
    this.pagerResult.items[index] = item;
    this.items[index] = item;

    this.table.renderRows();
  }
}
