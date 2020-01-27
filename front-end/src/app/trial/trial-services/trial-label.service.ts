import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

/**
 * Trial label service, serves multiple components and provides label information from 
 * the API 
 */
@Injectable({
  providedIn: 'root'
})
export class TrialLabelService {

  constructor(private http: HttpClient) { }
  /**
   * Return a label data object referenced in a treatment item.
   * See laebl.mode.js in api_store.
   * @param {string} labelID
   * @returns {Observable} 
   */
  getLabelByID(labelID) {
    return this.http.get(environment.apiURI + '/label/' + labelID);
  }
}
