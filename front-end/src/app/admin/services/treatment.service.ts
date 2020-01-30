import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class TreatmentService implements Resolve<Observable<any>>{
  /**Variable for holding all treatments loaded from API. */
  treatments: any[];
  /**EventEmitter for notifying all components that need to update if values are changed. */
  refreshUI = new EventEmitter();
  /**@ignore */
  constructor(private http: HttpClient) { }

  // getter
  /**
   *Get items of specific treatment that is already loaded into memory. 
   * @param treatmentID 
   * @returns {Array} of items.
   */
  getItemsofTreatment(treatmentID) {
    return this.treatments[this.treatments.findIndex(x => x._id == treatmentID)].items;
  }

  /**
   * ???
   * @param treatmentID 
   * @param items 
   */
  getItemsOfTreatmentByArray(treatmentID, items) {
    const treatment = this.treatments[this.treatments.findIndex(x => x._id == treatmentID)];
    let result = [];
    items.forEach(element => {
      const ind = treatment.items.findIndex(x => x._id == element);
      if (ind == -1) {
        return;
      }
      result.push(treatment.items[ind]);
    });
    return result;
  }

  /**
   * Function for updating item on treatment.
   * @param item 
   * @returns {Observable}
   */
  updateInformationOfItemInTreatment(item) {
    return this.http.put(environment.apiURI + '/treatment/item', item);
  }

  /**
   * Function for instatiating a new treatment. Called when navigating to treatment create component.
   * @returns {Observable}
   */
  getNewTreatmentID() {
    return this.http.post(environment.apiURI + '/treatment', {});
  }

  // setter
  /**
   * Replacing treatment information after an updated treatment is available.
   * @param treatment 
   */
  replaceTreatment(treatment) {
    const ind = this.treatments.findIndex(x => x._id == treatment._id);
    this.treatments.splice(ind, 1, treatment);
  }

  /**
   * Function for updating whole treatment information.
   * @param body 
   * @returns {Observable}
   */
  updateSpecificTreatment(body) {
    return this.http.put(environment.apiURI + '/treatment', body);
  }

  /**
   * Function for adding items to treatment specification. 
   * @param id 
   * @param items 
   * @returns {Observable}
   */
  addItemsToTreatment(id, items) {
    return this.http.put(environment.apiURI + '/treatment/items/' + id, { items: items })
  }

  /**
   * Function for removing allocated items from treatment.
   * @param treatmentID 
   * @param itemID 
   * @returns {Observable}
   */
  removeItemFromTreatment(treatmentID, itemID) {
    return this.http.delete(environment.apiURI + '/deleteItem/' + treatmentID + '/' + itemID);
  }

  /**
   * Function for deleting a whole treatment specification.
   * @param id 
   * @returns {Observable}
   */
  deleteSpecificTreatment(id) {
    return this.http.delete(environment.apiURI + '/treatment/' + id);
  }

  /**
   * Function for saving custom filter tree to treatment specification.
   * @param id 
   * @param filterID 
   * @returns {Observable}
   */
  addFilterToTreatment(id, filterID) {
    return this.http.put(environment.apiURI + '/treatment/tree/' + id, { filter: filterID });
  }

  /**
   * Function for fetching all treatments specified by authenticated user.
   * @returns {Observable}
   */
  getAllTreatments() {
    return new Observable((sub) => {
      this.http.get(environment.apiURI + '/treatment').subscribe((val: any[]) => {
        this.treatments = val;
        sub.next(this.treatments);
      });
    });
  }

  /**
   * Function for fetching a specific treatment associated to a treatment.
   * @param id 
   * @returns {Observable}
   */
  getSpecificTreatment(id) {
    return this.http.get(`${environment.apiURI}/treatment/${id}`);
    
    // return new Observable((sub) => {
    //   this.getAllTreatments().subscribe((val: any[]) => {
    //     sub.next(this.treatments.filter((x) => { return x._id == id }));
    //   })
    // });
  }
  /**
   * Function for emitting refresh UI components.
   * @emits
   */
  emitRefreshUI() {
    this.refreshUI.emit();
  }

  /**
   * Function for recieving trial data?
   * @param treatmentID 
   * @returns {Observable}
   */
  getAllDataOfTreatment(treatmentID) {
    return this.http.get(environment.apiURI + '/download/data/' + treatmentID);
  }

  enableDisableTreatment(treatmentID, bol) {
    if(bol) {
      return this.http.get(`${environment.apiURI}/activate/tr/${treatmentID}`)
    } else {
      return this.http.get(`${environment.apiURI}/deactivate/tr/${treatmentID}`)
    }
  }

  // for new Treatement information before editing it
  /**
   * Function for router resolver, when navigating to treatment create and it should be a new treamtent.
   * @returns {Observable}
   */
  resolve() {
    return this.getNewTreatmentID();
  }
}
