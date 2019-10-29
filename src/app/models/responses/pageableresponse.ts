export interface PageableResponse<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  sort: Sort;
  first: boolean;
  size: number;
  empty: boolean;
}

export interface Pageable {
  sort: Sort;
  pageSize: number;
  pageNumber: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}
