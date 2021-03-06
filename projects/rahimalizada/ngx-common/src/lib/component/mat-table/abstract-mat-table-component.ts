import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Directive, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, delay, distinctUntilChanged, startWith, switchMap, tap } from 'rxjs/operators';
import { PagerPathProvider } from '../../model/pager/pager-path-provider.model';
import { AbstractRestService } from '../../rest/abstract-rest.service';
import { PagerResult } from './../../model/pager/pager-result.model';

@Directive()
export abstract class AbstractMatTableDirective<T> implements OnInit, OnDestroy, AfterViewInit {
  private static readonly DEFAULT_PAGE_SIZE = 10;

  @Input()
  pagerParamsSubject = new Subject<{ search?: string; filters?: unknown }>();

  @Input()
  reloadTableSubject = new Subject<void>();

  @Input()
  selectionClearSubject = new Subject<void>();

  @Output()
  itemCountChange = new EventEmitter<number>();

  @Output()
  selectionChange = new EventEmitter<T[]>();

  @Input()
  withSelection = false;

  @Input()
  multiSelect = true;

  @ViewChild(MatTable, { static: false }) private table!: MatTable<T>;
  @ViewChild(MatPaginator, { static: false }) private paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) private sort!: MatSort;

  private search: string | undefined;
  private filters: unknown;

  public pageSizeOptions = [5, 10, 25, 100, 200];
  public currentPageSize?: number;

  public pagerResult!: PagerResult<T>;
  public isLoading = true;
  public items: T[] = [];
  public itemsSubject = new Subject<T[]>();
  public userId?: string;

  private subscription!: Subscription;
  public selection!: SelectionModel<T>;
  private eventSubscriptions = new Subscription();

  constructor(
    protected service: AbstractRestService<T>,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected pagerPathProvider: PagerPathProvider,
  ) {}

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.params.userId;
    this.selection = new SelectionModel<T>(this.multiSelect, []);
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

    this.eventSubscriptions.add(
      this.reloadTableSubject.subscribe(() => {
        this.reloadTable();
      }),
    );

    this.eventSubscriptions.add(
      this.selectionClearSubject.subscribe(() => {
        this.clearSelection();
      }),
    );
  }

  ngAfterViewInit(): void {
    this.reloadTable();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.eventSubscriptions.unsubscribe();
  }

  private loadData(): Observable<PagerResult<T>> {
    const pagerPath = this.pagerPathProvider.getPagerPath();
    const observable = pagerPath
      ? this.service.pagerByPath(
          pagerPath,
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.sort.active,
          this.sort.direction,
          this.search,
          this.filters,
        )
      : this.service.pager(
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.sort.active,
          this.sort.direction,
          this.search,
          this.filters,
        );

    return observable.pipe(
      tap((val) => {
        this.itemsSubject.next(val.items);
        this.itemCountChange.next(val.items.length);
        this.clearSelection();
      }),
    );
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

  protected reloadTable(): void {
    // TODO private, do through subject
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    const observable: Observable<PagerResult<T>> = merge(
      this.sort?.sortChange.pipe(tap(() => this.paginator.firstPage())),
      this.pagerParamsSubject.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((requestParams) => {
          this.search = requestParams.search;
          this.filters = requestParams.filters;
        }),
        tap(() => this.paginator.firstPage()),
      ),
      this.paginator.page.pipe(),
    ).pipe(
      startWith(null),
      switchMap(() => {
        this.isLoading = true;
        return this.loadData();
      }),
      tap(() => {
        this.isLoading = false;
      }),
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

  private clearSelection(): void {
    this.selection.clear();
    this.selectionChange.emit(this.selection.selected);
  }

  protected updateItem(index: number, item: T): void {
    this.pagerResult.items[index] = item;
    this.items[index] = item;

    this.table.renderRows();
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.items.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.items.forEach((row) => this.selection.select(row));
    }
    this.selectionChange.emit(this.selection.selected);
  }

  changeSelection(row: T): void {
    this.selection.toggle(row);
    this.selectionChange.emit(this.selection.selected);
  }
}
