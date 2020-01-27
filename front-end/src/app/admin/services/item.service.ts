import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  /**EventEmitter close edit */
  closeEdit: EventEmitter<any> = new EventEmitter();
  /**@ignore */
  constructor(private http: HttpClient) { }
  /**
   * Emitter for closing edit view.
   */
  emitCloseEdit() {
    this.closeEdit.emit(true);
  }
  /**
   * Function for getting all base items of specified by authenticated users. 
   * @returns {Observable}
   */
  getAllItems() {
    return this.http.get(environment.apiURI + '/my/items').pipe(catchError(val => of(`I caught: ${val}`)));
  }

  /**
   * Function for saving new item.
   * @param item 
   * @returns {Observable}
   */
  saveNewItem(item) {
    return this.http.post(environment.apiURI + '/item', item);
  }

  /**
   * Function for updating item. 
   * @param item 
   * @returns {Observable}
   */
  saveEditedItem(item) {
    return this.http.put(environment.apiURI + '/item', item);
  }

  /**
   * Getting items based on items array on ref ids. 
   * @param items 
   * @returns {Observable}
   */
  getItemsByArray(items) {
    return this.http.post(environment.apiURI + '/get/array/items', {items: items});
  }

  /**
   * Delete base item on the basis of itemID.
   * @param itemID 
   * @returns {Observable}
   */
  deleteBaseItem(itemID) {
    return this.http.delete(environment.apiURI + '/item/' + itemID);
  }
}
