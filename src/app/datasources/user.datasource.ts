import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { User } from "../models/entities/user";
import { BehaviorSubject, Observable, of } from "rxjs";
import { UserService } from "../services/user.service";
import { catchError, finalize } from "rxjs/operators";
import { PageableResponse } from "../models/responses/pageableresponse";

export class UserDataSource implements DataSource<User> {
  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private totalElementsSubject = new BehaviorSubject<number>(0);
  public loading = this.loadingSubject.asObservable();
  public totalElements = this.totalElementsSubject.asObservable();

  constructor(private userService: UserService) {}

  connect(collectionViewer: CollectionViewer): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.usersSubject.complete();
    this.loadingSubject.complete();
    this.totalElementsSubject.complete();
  }

  loadUser(elements: number, page: number, filter?: string, role?: string) {
    this.loadingSubject.next(true);
    if (filter || role) {
      this.userService
        .getUsersWithFilters(filter, role, elements, page)
        .pipe(
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(data => {
          const response = data as PageableResponse<User>;
          this.totalElementsSubject.next(response.totalElements);
          this.usersSubject.next(response.content);
        });
    } else {
      this.userService
        .getUsers(elements, page)
        .pipe(
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(data => {
          const response = data as PageableResponse<User>;
          this.totalElementsSubject.next(response.totalElements);
          this.usersSubject.next(response.content);
        });
    }
  }
}
