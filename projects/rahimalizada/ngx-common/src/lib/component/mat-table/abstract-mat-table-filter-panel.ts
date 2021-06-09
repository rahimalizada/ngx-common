import { ViewportScroller } from '@angular/common';
import { Directive, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { delay, distinctUntilChanged } from 'rxjs/operators';

@Directive()
export class AbstractMatTableFilterPanel implements OnInit {
  @Input()
  fields: string[] = [];

  @Input()
  searchEnabled = true;

  @Input()
  filtersEnabled = true;

  @Input()
  pagerParamsSubject = new Subject<{ search?: string; filters?: unknown }>();

  expanded = false;
  filterForm!: FormGroup;
  searchForm!: FormGroup;

  constructor(
    protected fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private viewportScroller: ViewportScroller,
  ) {}

  ngOnInit(): void {
    if (!this.filterForm) {
      this.filterForm = this.fb.group({
        type: null,
      });
    }

    if (!this.searchForm) {
      this.searchForm = this.fb.group({ search: null });
    }

    this.subscribeToFilterFormChange();
    this.subscribeToSearchFormChange();

    of('')
      .pipe(delay(0))
      .subscribe(() => this.loadState());
  }

  public showField(...names: string[]): boolean {
    for (const name of names) {
      if (this.fields.indexOf(name) > -1) {
        return true;
      }
    }
    return false;
  }

  private subscribeToSearchFormChange(): void {
    this.searchForm.valueChanges //
      .pipe(distinctUntilChanged()) // Material select with null value bug fix
      .subscribe(() => this.onFormsChange());
  }

  private subscribeToFilterFormChange(): void {
    this.filterForm.valueChanges //
      .pipe(distinctUntilChanged()) // Material select with null value bug fix
      .subscribe(() => this.onFormsChange());
  }

  private onFormsChange(): void {
    this.saveState();

    const searchState = this.searchForm.getRawValue().search;
    const filterState = this.filterForm.getRawValue();
    // Remove null properties from this object
    Object.keys(filterState).forEach((key) => !filterState[key] && delete filterState[key]);

    const data = {
      search: searchState && searchState.trim().length > 0 ? searchState : undefined,
      filters: Object.entries(filterState).length > 0 ? filterState : undefined,
    };
    this.pagerParamsSubject.next(data);
  }

  private loadState(): void {
    const searchState = this.activatedRoute.snapshot.queryParamMap.get('search');
    if (searchState) {
      this.searchForm.patchValue({ search: searchState });
    }

    const filterParam = this.activatedRoute.snapshot.queryParamMap.get('filters');
    if (!filterParam) {
      return;
    }
    const filterState = JSON.parse(filterParam);
    if (filterState) {
      this.expanded = true;
      this.filterForm.patchValue(filterState);
    }
  }

  private saveState(): void {
    const searchState = this.searchForm.getRawValue().search;
    const filterState = this.filterForm.getRawValue();
    Object.keys(filterState).forEach((key) => !filterState[key] && delete filterState[key]);

    const scrollPosition = this.viewportScroller.getScrollPosition();
    this.router
      .navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { search: searchState, filters: JSON.stringify(filterState) },
        queryParamsHandling: 'merge',
      })
      .then(() => this.viewportScroller.scrollToPosition(scrollPosition));
  }

  private resetState(): void {
    const scrollPosition = this.viewportScroller.getScrollPosition();
    this.router
      .navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { search: null, filters: null },
        queryParamsHandling: 'merge',
      })
      .then(() => this.viewportScroller.scrollToPosition(scrollPosition));
  }
}
