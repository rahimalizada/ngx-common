import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject, Subscription } from 'rxjs';
import { delay, distinctUntilChanged } from 'rxjs/operators';

@Directive()
export class AbstractMatTableFilterPanel implements OnInit, OnDestroy {
  @Input()
  fields: string[] = [];

  @Input()
  searchEnabled = true;

  @Input()
  filtersEnabled = true;

  @Input()
  searchTermsSubject = new Subject<string | undefined>();

  @Input()
  requestFiltersSubject = new Subject<unknown>();

  private subscriptions = new Subscription();

  expanded = false;
  filterForm!: FormGroup;
  searchForm!: FormGroup;

  constructor(protected fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.filterForm) {
      this.filterForm = this.fb.group({
        type: null,
      });
    }

    if (!this.searchForm) {
      this.searchForm = this.fb.group({ search: null });
    }

    this.onFilterFormChange();
    this.onSearchFormChange();

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

  private onSearchFormChange(): void {
    // Save search terms
    const subscription = this.searchTermsSubject
      .pipe(
        delay(0), // Required, bug
      )
      .subscribe(() => this.saveState());
    this.subscriptions.add(subscription);

    this.searchForm.valueChanges.subscribe((value) => {
      if (value.search && value.search.trim().length > 0) {
        this.searchTermsSubject.next(value.search);
      } else {
        this.searchTermsSubject.next(undefined);
      }
    });
  }

  private onFilterFormChange(): void {
    this.filterForm.valueChanges //
      .pipe(distinctUntilChanged()) // Material select with null value bug fix
      .subscribe((value) => {
        // Remove null properties from this object
        Object.keys(value).forEach((key) => !value[key] && delete value[key]);
        const isEmpty = Object.entries(value).length === 0;
        this.saveState();
        if (isEmpty) {
          this.requestFiltersSubject.next(undefined);
        } else {
          this.requestFiltersSubject.next(value);
        }
      });
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

  private saveState(): Promise<boolean> {
    const searchState = this.searchForm.getRawValue().search;
    const filterState = this.filterForm.getRawValue();
    Object.keys(filterState).forEach((key) => !filterState[key] && delete filterState[key]);

    return this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { search: searchState, filters: JSON.stringify(filterState) },
      queryParamsHandling: 'merge',
    });
  }

  private resetState(): Promise<boolean> {
    return this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { search: null, filters: null },
      queryParamsHandling: 'merge',
    });
  }
}
