import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

/**
 * Service for CRUD for tax specificaitons.
 */
@Injectable({
  providedIn: 'root'
})
export class TaxService {
  /**
   * @ignore
   * @param http 
   */
  constructor(private http: HttpClient) { }

  /**
   * Get function for all created taxes.
   * @returns {Observable}
   */
  getAllTaxes() {
    return this.http.get(`${environment.apiURI}/options/tax`);
  }

  /**
   * Function for saving new tax specification.
   * @param body 
   * @returns {Observable}
   */
  saveNewTax(body) {
    return this.http.post(`${environment.apiURI}/options/tax`, body);
  }

  /**
   * Function for updating tax information. 
   * @param body 
   * @returns {Observable}
   */
  updateTaxInformation(body) {
    return this.http.put(`${environment.apiURI}/options/tax/${body._id}`, body)
  }
}
