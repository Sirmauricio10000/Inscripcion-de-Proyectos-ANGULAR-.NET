import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HandleHttpErrorService } from '../@base/handle-http-error.service';
import { catchError, map } from 'rxjs/operators';
import { Usuario } from '../proyecto/models/usuario';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<Usuario>;
    public currentUser: Observable<Usuario>;
    baseUrl: string;

    constructor(
      private http: HttpClient,
      @Inject('BASE_URL') baseUrl: string,
      private handleErrorService: HandleHttpErrorService) {
            this.currentUserSubject = new BehaviorSubject<Usuario>(JSON.parse(localStorage.getItem('currentUser')));
            this.currentUser = this.currentUserSubject.asObservable();
            this.baseUrl=baseUrl;
      }   


   public get currentUserValue():Usuario{
      return this.currentUserSubject.value;
   }

    login(username, password) {
        return this.http.post<any>(`${this.baseUrl}api/login`, { username, password })
        .pipe(map(user => {
         // store user and jwt token in local storage to keep user logged in between page refreshes
         localStorage.setItem('currentUser', JSON.stringify(user));
         this.currentUserSubject.next(user);
         return user;
         }), catchError(this.handleErrorService.handleError<Usuario>('Inicio de sesion', null)));
    } 

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
        
}