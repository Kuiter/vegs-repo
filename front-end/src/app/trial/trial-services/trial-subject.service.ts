import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


/**
 * Trial subject service delivers subject specific information.
 * Used by multiple components.
 */
@Injectable({
  providedIn: 'root'
})
export class TrialSubjectService {
  /**SubjectID of current subject performing test. */
  id: any;
  /**Switch for determining if the data generated should be recorded (saved to database). */
  recording: boolean = false;

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Sets subjectID in memory and in session store.
   * @param {string} id 
   */
  setSubjectID(id) {
    this.id = id;
    sessionStorage.setItem('subjectID', id);
  }

  /**
   * Checks if id is in memory if not returns id from session storage.
   * @returns {string} subjectID
   */
  getSubjectID(): string {
    if (!this.id) {
      // error subject reference lost or not provided? get from route
      this.setSubjectID(sessionStorage.getItem('subjectID'));
    }
    return this.id;
  }

  /**
   * Checks if trial data is recording (flag on trial model). If has not already ended sets
   * flag to recording true.
   * @param treatmentID 
   * @param subjectID 
   * @returns {Observable}
   */
  checkDataRecording(treatmentID, subjectID) {
    return new Observable((sub) => {
      this.http.get(environment.apiURI + '/check/trial/' + treatmentID + '/' + subjectID)
        .subscribe(
          (val) => {
            this.recording = true;
            sub.next(val);
          },
          (error) => {
            sub.error(error);
            this.recording = false;
          }
        );
    });
  }

  /**
   * Generates a one-of subject for starting a trial.
   * @param {string} id treatmentID
   * @returns {Observable} subject Object
   */
  generateNewSubject(id) {
    // this.http.get()
    return this.http.post(environment.apiURI + '/subject/create/' + id, { name: 'N/A', reusable: false });
  }
}
