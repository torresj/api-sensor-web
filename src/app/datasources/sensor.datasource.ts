import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Sensor } from "../models/entities/sensor";
import { BehaviorSubject, Observable, of } from "rxjs";
import { SensorService } from "../services/sensor.service";
import { catchError, finalize } from "rxjs/operators";
import { PageableResponse } from "../models/responses/pageableresponse";

export class SensorDataSource implements DataSource<Sensor> {
  private sensorsSubject = new BehaviorSubject<Sensor[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private totalElementsSubject = new BehaviorSubject<number>(0);
  public loading$ = this.loadingSubject.asObservable();
  public totalElements$ = this.totalElementsSubject.asObservable();
  public houses$ = this.sensorsSubject.asObservable();

  constructor(private sensorService: SensorService) {}

  connect(collectionViewer: CollectionViewer): Observable<Sensor[]> {
    return this.sensorsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.sensorsSubject.complete();
    this.loadingSubject.complete();
    this.totalElementsSubject.complete();
  }

  loadSensors(elements: number, page: number, filter: string, typeId: number) {
    this.loadingSubject.next(true);
    this.sensorService
      .getSensors$(elements, page, filter, typeId)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(data => {
        const response = data as PageableResponse<Sensor>;
        this.totalElementsSubject.next(response.totalElements);
        this.sensorsSubject.next(response.content);
      });
  }
}
