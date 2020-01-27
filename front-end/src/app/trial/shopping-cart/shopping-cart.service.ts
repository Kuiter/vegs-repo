import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { TrialSubjectService } from '../trial-services/trial-subject.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

/**
 * 
 */

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  /**Holds current shopping cart. */
  cart: any[] = [];
  /**Eventemitter for updateing remaining budget if items are added to a cart. */
  showRemainder = new EventEmitter();

  constructor(
    private trialSubjectService: TrialSubjectService,
    private http: HttpClient
  ) { }

  /**
   * Function for getting current cart from API (in the event of a page reload).
   * Sets the cart variable.
   */
  getAndSetCart() {
    const subjectID = sessionStorage.getItem('subjectID');
    const treatmentID = sessionStorage.getItem('treatmentID');
    // const treatmentAndSubjectURL = treatmentID + '/' + subjectID;
    this.http.get(environment.apiURI + '/trial/currentCart/' + treatmentID + '/' + subjectID).subscribe(
      (cart: any) => {
        this.cart = cart;
      },
      (error) => {
        console.log('No current cart yet');
      }
    );
  }

  /**
   * Function for external use of event emission if remaining sum should be recalculated.
   * @param {Boolean} bool 
   */
  emitShowRemainder(bool) {
    this.showRemainder.emit(bool)
  }

  /**
   * Getter for current cart.
   * @returns {Array} this.cart
   */
  getCart() {
    return this.cart;
  }

  /**
   * Function for item addition to cart.
   * @emits showRemainder
   * @param item 
   * @param amount 
   */
  addItemToCart(item, amount) {
    this.emitShowRemainder(true);
    if (this.cart) {
      let index = this.cart.findIndex(x => x.item._id == item._id);
      if (index != -1) {
        // send info that item amount was changed may be delta?
        this.cart[index].amount += amount;
        return;
      }
    }
    if (!this.cart) {
      // erst ein http request to see if their is any cart
      this.cart = [];
    }
    // send Information which item and amount
    this.cart.push({
      item: item,
      amount: amount
    });
    this.updateCartBackend({ itemID: item._id, delta: amount, identifier: 'addition' });
  }

  /**
   * Function for removing item from cart.
   * @emits showRemainder
   * @param {Object} item 
   */
  removeItemFromCart(item) {
    // send Information that item was deleted
    const ind = this.cart.findIndex(x => x.item._id == item._id);
    const amount = this.cart[ind].amount;
    this.cart.splice(ind, 1);
    this.updateCartBackend({ itemID: item._id, identifier: 'deletion', delta: -amount });
    if (this.cart.length == 0) {
      this.emitShowRemainder(false);
    }
  }

  /**
   * Funtion for changing the amount of an item already in the shopping cart.
   * @param {Object} item 
   * @param {Number} delta 
   */
  changeAmountOfItem(item, delta) {
    //post Info to backend or info service?
    this.cart[this.cart.findIndex(x => x.item == item)].amount += delta;
    this.updateCartBackend({ identifier: 'change', itemID: item._id, delta: delta });
  }

  /**
   * Function for updating the shopping cart and recording the shopping cart event.
   * @param {Object} obj 
   * @param {String} obj.identifier ('change' | 'deletion' | 'addition')
   * @param {String} obj.itemID
   * @param {Number} obj.delta
   */
  updateCartBackend(obj) {
    if (this.trialSubjectService.getSubjectID() == '0') {
      return;
    }
    // if (!this.subjectID || !this.treatmentID) {
    //   this.subjectID = sessionStorage.getItem('subjectID')
    //   this.treatmentID = sessionStorage.getItem('treatmentID');
    // }
    const subjectID = sessionStorage.getItem('subjectID');
    const treatmentID = sessionStorage.getItem('treatmentID');
    // const treatmentAndSubjectURL = treatmentID + '/' + subjectID;
    // set current cart
    this.http.put(environment.apiURI + '/trial/currentCart/' + treatmentID + '/' + subjectID, { cart: this.cart }).subscribe(
      () => {},
      (error) => {
        console.log("can't save current cart");
        console.error(error);
      }
    );
    // update data Object
    let t = new Date().toISOString();
    obj.time = t;
    this.http.put(environment.apiURI + '/trial/transaction/' + treatmentID + '/' + subjectID, obj).subscribe(
      () => {},
      (error) => {
        // would be detremental so pause experiment?
        console.error(error);
      }
    );
  }

  /**
   * Function for calculating the sum of all item prices.
   * @returns {Number}
   */
  calcSumPriceOfItems() {
    let sum = 0;
    if (!this.cart) {
      return sum;
    }
    this.cart.forEach(element => {
      let taxes = 0;
      if (element.item.taxes.length > 0) {
        for (let t of element.item.taxes) {
          taxes += Math.round(t.amount * element.item.netPrice * 100) / 100;
        }
      }
      sum += Math.round(((element.item.netPrice + taxes) * (1 + element.item.vat)) * 100) / 100 * element.amount;
    });
    return sum;
  }
}
