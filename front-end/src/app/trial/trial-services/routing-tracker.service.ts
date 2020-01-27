import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TrialSubjectService } from './trial-subject.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TrialTreatmentService } from './trial-treatment.service';


/**
 * Routing tracker service subscribes to router events and writes 
 * route changes to trial data (API).
 */
@Injectable({
  providedIn: 'root'
})
export class RoutingTrackerService {

  /**@ignore */
  subjectID = sessionStorage.getItem('subjectID')
  /**@ignore */
  treatmentID = sessionStorage.getItem('treatmentID');

  //fall back not recorded?
  /**Array that stores routing data not recorded because of any error from api. NOT IMPLEMENTED */
  notRecorded = [];
  origin: any;

  constructor(
    private router: Router,
    private trialSubjectService: TrialSubjectService,
    private http: HttpClient
  ) {
    this.routeEvent(this.router);
  }
  /**
   * Listens for router events and writes route changes to the trial data collection. 
   * Data collected: {origin: String, destination: String, time: String}
   * @param {Router} router 
   */
  routeEvent(router: Router) {
    this.origin = router.url
    router.events.subscribe((event) => {
      if (!this.trialSubjectService.recording) {
        return;
      }
      let t = new Date().toISOString();
      let result: any = {};
      // result.origin = this.origin;
      if (event instanceof NavigationEnd) {
        const subjectID = sessionStorage.getItem('subjectID');
        const treatmentID = sessionStorage.getItem('treatmentID');
        // send Information to tracking in backend?
        if (!this.trialSubjectService.recording) {
          return;
        }
        result.origin = this.origin;
        result.destination = event.url;
        this.origin = event.url;
        result.time = t;
        this.http.put(environment.apiURI + '/trial/routing/' + treatmentID + '/' + subjectID, result).subscribe(
          () => { },
          (error) => {
            this.notRecorded.push(result);
          }
        )
      }
    });
  }
}
