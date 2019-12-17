import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { PageableResponse } from "../models/responses/pageableresponse";
import { House } from "../models/entities/house";
import { HouseService } from "../services/house.service";

export class HouseDataSource implements DataSource<House> {
  private housesSubject = new BehaviorSubject<House[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private totalElementsSubject = new BehaviorSubject<number>(0);
  public loading$ = this.loadingSubject.asObservable();
  public totalElements$ = this.totalElementsSubject.asObservable();
  public houses$ = this.housesSubject.asObservable();

  constructor(private houseService: HouseService) {}

  connect(collectionViewer: CollectionViewer): Observable<House[]> {
    return this.housesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.housesSubject.complete();
    this.loadingSubject.complete();
    this.totalElementsSubject.complete();
  }

  loadHouses(elements: number, page: number, filter?: string) {
    this.loadingSubject.next(true);
    if (filter) {
      this.houseService
        .getHousesWithFilters$(filter, elements, page)
        .pipe(
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(data => {
          const response = data as PageableResponse<House>;
          this.totalElementsSubject.next(response.totalElements);
          this.housesSubject.next(response.content);
        });
    } else {
      this.houseService
        .getHouses$(elements, page)
        .pipe(
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(data => {
          const response = data as PageableResponse<House>;
          this.totalElementsSubject.next(response.totalElements);
          this.housesSubject.next(response.content);
        });
    }
  }
}
