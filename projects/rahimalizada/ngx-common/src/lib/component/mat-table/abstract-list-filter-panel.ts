import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { delay, distinctUntilChanged } from 'rxjs/operators';
import { PagerRequestFiltersType } from '../../model/pager/pager-request-filters-type.enum';

@Directive()
export class AbstractListFilterPanel implements OnInit, OnDestroy {
  @Input()
  fields: string[] = [];

  @Input()
  searchEnabled = true;

  @Input()
  filtersEnabled = true;

  @Input()
  searchTermsSubject = new BehaviorSubject<string | undefined>(undefined);

  @Input()
  requestFiltersSubject = new BehaviorSubject<unknown>(undefined);

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
        type: PagerRequestFiltersType.AND,
      });
    }

    if (!this.searchForm) {
      this.searchForm = this.fb.group({ search: null });
    }

    this.activatedRoute.queryParamMap.subscribe((val) => {
      const searchParam = val.get('search');
      if (searchParam == null && this.searchForm.value.search != null) {
        this.searchForm.patchValue({ search: null });
      }
    });

    this.onFilterFormChange();
    this.loadFiltersState();

    this.onSearchFormChange();
    this.loadSearchState();
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
      .subscribe((search?) => {
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: { search },
          queryParamsHandling: 'merge',
        });
      });
    this.subscriptions.add(subscription);

    this.searchForm.valueChanges.subscribe((value) => {
      if (value.search && value.search.trim().length === 0) {
        this.searchTermsSubject.next(undefined);
      } else {
        this.searchTermsSubject.next(value.search);
      }
    });
  }

  private loadSearchState(): void {
    const search = this.activatedRoute.snapshot.queryParamMap.get('search');
    const currentValue = this.searchForm.value.search;
    if (currentValue !== search) {
      this.searchForm.patchValue({ search });
    }
  }

  private onFilterFormChange(): void {
    this.filterForm.valueChanges //
      .pipe(distinctUntilChanged()) // Material select with null value bug fix
      .subscribe((value) => {
        // Remove null properties from this object
        Object.keys(value).forEach((key) => value[key] == null && delete value[key]);
        const isEmpty = Object.entries(value).length === 0;
        if (isEmpty) {
          this.resetFiltersState();
          this.requestFiltersSubject.next(undefined);
        } else {
          this.saveFiltersState();
          this.requestFiltersSubject.next(value);
        }
      });
  }

  private loadFiltersState(): void {
    const value = JSON.parse(localStorage.getItem('pager-request-filters') as string);
    if (value !== null) {
      this.expanded = true;
      this.filterForm.patchValue(value);
    }
  }

  private saveFiltersState(): void {
    localStorage.setItem('pager-request-filters', JSON.stringify(this.filterForm.value));
  }

  private resetFiltersState(): void {
    localStorage.removeItem('pager-request-filters');
  }
}
