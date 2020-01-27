import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ProductService } from './product.service';
import { FilterService } from './filter.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';

/**
 * Service for providing data in connection to the treatment specification.
 * Serves multiple components.
 */
@Injectable({
  providedIn: 'root'
})
export class TrialTreatmentService implements Resolve<Observable<any>> {
  /**Holds the db index of current treatment. */
  treatmentID: String;
  /**Holds the treatment data of current treatment. */
  treatmentData: any;

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private filterService: FilterService,
    private shoppingCartService: ShoppingCartService
  ) { }

  /**
   * checks if treatmentID is still in memory if not gets it from the session store.
   * @returns {string} treatmentID
   */
  getTreatmentID(): String {
    if (!this.treatmentID) {
      this.setTreatmentID(sessionStorage.getItem('treatmentID'));
    }
    return this.treatmentID;
  }

  /**
   * Sanity check for routing from shop landing to products page.
   * @returns {boolean} 
   */
  checkRoute(): boolean {
    return this.treatmentData != undefined;
  }

  /**
   * Resets all data lost when treatemet is reloaded by user. 
   * Sets 
   * @param treatmentData 
   */
  setTreatmentDataOnReload(treatmentData) {
    this.setTreatmentID(treatmentData._id);
    this.treatmentData = treatmentData;
    this.shoppingCartService.getAndSetCart();
    this.productService.resetProducts(treatmentData.items);
    this.filterService.setData(treatmentData.filters);
  }

  // for selecting 
  /**
   * For retrieving specific treatment data, selection process during 
   * trial config. 
   * @param {string} id 
   * @returns {Observable<treatmentData>} 
   */
  getSpecificTreatmentData(id): Observable<any> {
    this.setTreatmentID(id);
    return new Observable((sub) => {
      this.http.get(environment.apiURI + '/t/' + id).subscribe(
        (val) => {
          this.treatmentData = val;
          sub.next(val);
          sub.complete();
        },
        (error) => {
          sub.error(error);
        }
      );
    });
  }
  /**
   * Sets treatmentID in memory and in session storage.
   * @param {string} id 
   */
  setTreatmentID(id): void {
    sessionStorage.setItem('treatmentID', id);
    this.treatmentID = id;
  }

  /**
   * Used for router resolver, delivers treatment Data. 
   * @param {ActivatedRouteSnapshot} route 
   * @returns {Observable<treatementData>}
   */
  resolve(route: ActivatedRouteSnapshot) {
    let id = route.paramMap.get('treatmentID');
    return new Observable((sub) => {
      if (this.treatmentData) {
        sub.next(this.treatmentData);
        sub.complete()
        return;
      }
      this.getSpecificTreatmentData(id).subscribe(
        (val) => {
          sub.next(val);
          sub.complete();
        }
      );
    });
  }

  /**
   * @returns {string} currency specification in first treamtent item
   */
  getCurrency() {
    return this.treatmentData.items[0].currency;
  }

  /**
   * Return only showOptions from specified treatment.
   * @returns {Object} display options
   */
  getDisplayOptions() {
    if (!this.treatmentData.showOptions) {
      return { showSum: true, numOfItems: 10 };
    }
    return this.treatmentData.showOptions;
  }

  getSwapConfig() {
    return this.treatmentData.swapConfig;
  }

  /**
   * Post to start treatment data recording. Called after trial config step is done.
   * @param treatmentID 
   * @param subjectID 
   * @returns {Observalble}
   */
  startTreatment(treatmentID, subjectID, device) {
    return this.http.post(`${environment.apiURI}/start/trial/${treatmentID}/${subjectID}`, device);
  }

  checkIfTreatmentActive(treatmentID) {
    return this.http.get(`${environment.apiURI}/check/active/${treatmentID}`);
  }

}