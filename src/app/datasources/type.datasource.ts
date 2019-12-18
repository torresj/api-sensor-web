import { SensorType } from "../models/entities/sensortype";
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { SensortypeService } from "../services/sensortype.service";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { PageableResponse } from "../models/responses/pageableresponse";

export class TypeDataSource implements DataSource<SensorType> {
  private typeSubject = new BehaviorSubject<SensorType[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private totalElementsSubject = new BehaviorSubject<number>(0);
  public loading$ = this.loadingSubject.asObservable();
  public totalElements$ = this.totalElementsSubject.asObservable();

  constructor(private sensorTypeService: SensortypeService) {}

  connect(collectionViewer: CollectionViewer): Observable<SensorType[]> {
    return this.typeSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.typeSubject.complete();
    this.loadingSubject.complete();
    this.totalElementsSubject.complete();
  }

  loadTypes(elements: number, page: number, filter?: string) {
    this.loadingSubject.next(true);
    if (filter) {
      this.sensorTypeService
        .getSensorTypeWithFilters$(filter, elements, page)
        .pipe(
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(data => {
          const response = data as PageableResponse<SensorType>;
          this.totalElementsSubject.next(response.totalElements);
          this.typeSubject.next(response.content);
        });
    } else {
      this.sensorTypeService
        .getTypes$(elements, page)
        .pipe(
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(data => {
          const response = data as PageableResponse<SensorType>;
          this.totalElementsSubject.next(response.totalElements);
          this.typeSubject.next(response.content);
        });
    }
  }
}
