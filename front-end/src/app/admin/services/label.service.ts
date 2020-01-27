import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

/**
 * CRUD Service for label data.
 */
@Injectable({
  providedIn: 'root'
})
export class LabelService {
  /**@ignore */
  constructor(private http: HttpClient) { }

  /**
   * Function for recieving the all the labels owned by authenticated user.
   * @returns {Observable}
   */
  getAllMyLabel() {
    return this.http.get(environment.apiURI + '/my/label');
  }

  /**
   * Function for getting labels from backend.
   * @param {Object} label 
   * @returns {Observable}
   */
  getLabelByArray(label) {
    return this.http.post(environment.apiURI + '/array/label', { label: label })
  }

  /**
   * Function for saving new label.
   * @param {Object} label 
   * @returns {Observable}
   */
  saveNewLabel(label) {
    return this.http.post(environment.apiURI + '/label/data', label);
  }

  /**
   * Function for deleting specific label. 
   * @param {String} id
   * @returns {Observable} 
   */
  deleteSpecificLabel(id) {
    return this.http.delete(environment.apiURI + '/label/' + id);
  }

  /**
   * Not implemented.
   * @param label 
   */
  updateSpecificLabel(label) {
    console.log(label);
    // ...
  }
}
