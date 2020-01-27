import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TrialSubjectService } from './trial-subject.service';
import { Observable, of } from 'rxjs';
import { FilterService } from './filter.service';

/**
 * Handles assortment of different events used to transmit application state and 
 * data events between multiple components.
 */
@Injectable({
  providedIn: 'root'
})
export class EventsService {
  /**Eventemitter for use if an event should be recorded (i.e. saved to DB) */
  $recordEvent = new EventEmitter();
  /**Eventemitter for handling show back button in trial component. */
  showBack = new EventEmitter();
  /**For storing swap infos between swap started and swap ended event. */
  swapInfo: any;
  /**For storing information between lookupinfo started and ended event. */
  lookUpInfo: any;

  // treatmentAndSubjectURL = sessionStorage.getItem('treatmentID') + '/' + sessionStorage.getItem('subjectID');

  constructor(
    private http: HttpClient,
    private trialSubject: TrialSubjectService,
    private filterService: FilterService
  ) {
    this.$recordEvent.subscribe((val) => { this.recordEvent(val) })
    // this.recordFilterEvents();
  }

  /**
   * Provides the meand of emitting event for showing nav button.
   * @param bool 
   * @emits showBack with boolean
   */
  emitShowBack(bool) {
    this.showBack.emit(bool);
  }

  // data recording based on event
  /**
   * 
   * @param object 
   */
  recordEvent(object) {
    const subjectID = sessionStorage.getItem('subjectID');
    const treatmentID = sessionStorage.getItem('treatmentID');
    const treatmentAndSubjectURL = treatmentID + '/' + subjectID;
    if (!this.trialSubject.recording) {
      return;
    }
    let t = new Date().toISOString()
    let res: any = {};
    if (object.event == 'swapStarted') {
      res.started = t;
      Object.assign(res, object.data);
      this.swapInfo = res;

    } else if (object.event == 'swapEnded') {
      if (!this.swapInfo) {
        // geht nicht
      }
      res.ended = t;
      Object.assign(res, object.data);
      Object.assign(res, this.swapInfo);
      // send Info
      this.http.put(environment.apiURI + '/trial/swap/' + treatmentAndSubjectURL, res)
        .subscribe(
          () => {
            this.swapInfo = null;
          },
          (error) => { console.error(error) }
        );

    } else if (object.event == 'labelInfoOpened') {
      res.started = t;
      Object.assign(res, object.data);
      this.lookUpInfo = res;

    } else if (object.event == 'labelInfoClosed') {
      res.ended = t;
      Object.assign(res, object.data);
      Object.assign(res, this.lookUpInfo);
      // send
      this.http.put(environment.apiURI + '/trial/info/' + treatmentAndSubjectURL, res)
        .subscribe(
          () => {
            this.lookUpInfo = null;
          },
          (error) => { }
        );
    } else { }
  }

  /**
   * Records all filter events emitted. 
   * Subscribes to filtered, everytime a filter event is fired this event is send
   * to be put to the filtered data in trial.model.
   */
  recordFilterEvents(filter) {
    if (!this.trialSubject.recording) {
      return;
    }
    const subjectID = sessionStorage.getItem('subjectID');
    const treatmentID = sessionStorage.getItem('treatmentID');
    const treatmentAndSubjectURL = treatmentID + '/' + subjectID;
    let body = {
      filter: filter,
      time: new Date().toISOString()
    }
    this.http.put(`${environment.apiURI}/trial/filter/${treatmentAndSubjectURL}`, body).subscribe(
      () => { },
      (error) => { console.error(error) }
    )
  }
  /**
   * Seperate function to record sorting actions. 
   * @param {Object} sortOption 
   * @param {String} sortOption.filter
   * @param {String} sortOption.type
   */
  recordSorting(sortOption) {
    if (!this.trialSubject.recording) {
      return;
    }
    const subjectID = sessionStorage.getItem('subjectID');
    const treatmentID = sessionStorage.getItem('treatmentID');
    const treatmentAndSubjectURL = treatmentID + '/' + subjectID;

    const body = {
      filter: sortOption,
      time: new Date().toISOString()
    }

    this.http.put(`${environment.apiURI}/trial/filter/${treatmentAndSubjectURL}`, body).subscribe(
      () => { },
      (error) => { console.error(error) }
    );
  }
  /**
   * Triggered when checkout button in shopping-metrics.component is pressed
   * PUT request saves the final shopping cart to trial data.
   * @param {Array} cart 
   * @returns {Observable}
   */
  endShoppingSession(cart) {
    const subjectID = sessionStorage.getItem('subjectID');
    const treatmentID = sessionStorage.getItem('treatmentID');
    const treatmentAndSubjectURL = treatmentID + '/' + subjectID;
    return this.http.put(environment.apiURI + '/end/shoppingCart/' + treatmentAndSubjectURL, { cart: cart })
  }

  /**
   * Triggered when trial is completly finished. PUT request initiates actions that 
   * prohibit the application from recording more data to an already finished trial.
   * @returns {Observable}
   */
  endTrial() {
    const subjectID = sessionStorage.getItem('subjectID');
    const treatmentID = sessionStorage.getItem('treatmentID');
    const treatmentAndSubjectURL = treatmentID + '/' + subjectID;
    return new Observable((sub) => {
      this.http.put(environment.apiURI + '/end/trial/' + treatmentAndSubjectURL, {}).subscribe(
        (trialData) => {
          sub.next(trialData);
        },
        (error) => {
          sub.error(error);
        }
      )
    });
  }

  recordOptIn(data) {
    const subjectID = sessionStorage.getItem('subjectID');
    const treatmentID = sessionStorage.getItem('treatmentID');
    if (subjectID == '0') { return new Observable((sub) => { sub.next(); sub.complete(); }) }
    else { return this.http.put(`${environment.apiURI}/trial/swapOpts/${treatmentID}/${subjectID}`, data); }
  }

  async paginationEvent(body) {
    const subjectID = sessionStorage.getItem('subjectID');
    const treatmentID = sessionStorage.getItem('treatmentID');
    if (subjectID == '0') { return }
    await this.http.put(`${environment.apiURI}/trial/pagination/${treatmentID}/${subjectID}`, body).toPromise();
  }

}
