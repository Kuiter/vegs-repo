import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { RegisterData, LoginData } from './_models/user.model';
/**
 * Auth Service: Injectable for checking login status.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**Variable used for switching display based on login status. */
  isLoggedIn = false;
  /**Not used? */
  redirectUrl: string;
  /**
   * @ignore
   * @param http 
   */
  constructor(private http: HttpClient) { }
  /**
   * Checking Login status with existing credientials.
   * @returns {Observable}
   */
  checkLoginCredentials(): Observable<boolean> {
    return new Observable((sub) => {
      this.http.get(environment.apiURI + '/check').subscribe(
        (val: any) => { sub.next(val.auth) },
        (error) => {
          console.error(error);
          sub.next(false)
        }
      );
    })

  }
  /**
   * Function that post register request
   * @param user 
   * @returns {Observable}
   */
  registerUser(user: RegisterData) {
    return this.http.post(environment.apiURI + '/register', user);
  }
  /**
   * Function that posts login request
   * @param credentials 
   * @returns {Observable}
   */
  login(credentials: LoginData) {
    return this.http.post(environment.apiURI + '/login', credentials);
  }

}
