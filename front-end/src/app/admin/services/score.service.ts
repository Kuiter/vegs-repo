import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

/**
 * CRUD Service for score specification.
 */
@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  /**@ignore */
  constructor(private http: HttpClient) { }
  /**
   * Function for getting all scores.
   * @returns {Observable}
   */
  getAllScores() {
    return this.http.get(environment.apiURI + '/score');
  }
  /**
   * Function for saving new score information.
   * @param {Object} body 
   */
  saveNewScore(body) {
    return this.http.post(environment.apiURI + '/score', body);
  }
  /**
   * Function for updating score information.
   * @param {Object} body
   * @returns {Observable} 
   */
  updateScoreInformation(body) {
    return this.http.put(environment.apiURI + `/score/${body._id}`, body);
  }
  /**
   * Function for deleting score information.
   * @param {String} id 
   * @returns {Observable}
   */
  deleteScore(id) {
    return this.http.delete(environment.apiURI + `/score/${id}`);
  }
}
