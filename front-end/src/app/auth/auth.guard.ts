import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Route Guard for protecting administration route.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  /**@ginore */
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  /**
   * Function required by Interface CanActivate.
   * @param next 
   * @param state
   * @returns {Observable} 
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    const url: string = state.url;
    return this.checkLogin(url);
  }
  /**
   * Function required by interface CanActivateChild
   * @param {ActivatedRouteSnapshot} route 
   * @param {RouterStateSnapshot} state 
   * @returns {Observable}
   */
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
  /**
   * Used in can activate to verify user credentials (Auth session and session.sig)
   * @param {String} url 
   * @returns {Observable}
   */
  checkLogin(url: string): Observable<boolean> {
    return new Observable<boolean>((sub) => {
      this.authService.checkLoginCredentials().subscribe(
        (val: any) => {
          if (!val) {
            this.router.navigate(['/auth/login']);
            return;
          }
          sub.next(val)
        },
        (error) => {
          console.error(error);
          sub.next(false);
        }
      )
    })
  }
}
