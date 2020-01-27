import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

/**
 * Service for reading user data.
 */
@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  /**@ignore */
  constructor(
    private http: HttpClient
  ) { }
  /**
   * Get user info based on authenticated user.
   * @returns {Observable}
   */
  getUserInfo() {
    return this.http.get(environment.apiURI + '/user');
  }
}
