export interface PagerRequest {
  sort?: string;
  sortDirection?: string;
  page: number;
  pageSize: number;
  searchTerms: string[];
  requestFilters?: string;
}
