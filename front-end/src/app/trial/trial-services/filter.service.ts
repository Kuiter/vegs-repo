import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

/**
 * Filter service, provides and stores information about the filter status. For consistency between page changes.
 * Stores information about custom filter trees configured in the treatment settings.
 * Holds eventemitters for filter events.
 * Used by multiple components.
 */
@Injectable({
  providedIn: 'root'
})
export class FilterService {

  /**Holds all custom filters specified in a treatment. */
  filterTree: any[];
  /**Eventemitter that emits filtered event for use in product Service etc.
   * @emits Object
   */
  filtered: EventEmitter<any> = new EventEmitter();
  /**Holds the currently selected filter for consistency during page changes. */
  selectedFilter: any;
  /**Holds currentPage and items per page information, so that the paginator is not reset each time a page change happens. */
  navInfo: any;
  /**
   * Eventemitter for category filter NOT USED.
   */
  categoryFiltered: EventEmitter<any> = new EventEmitter();
  /**Eventemitter for resetFilter event.
   * @emits Boolean
   */
  resetFilter: EventEmitter<boolean> = new EventEmitter();
  /**
   * BehaviorSubject rxjs, emits if items in shop are filtered for displaying reset button
   */
  itemsFiltered: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient) { }

  /**
   * @returns {Array} current filter trees of treatment specification.
   */
  getFilterTrees() {
    if (!this.filterTree) {} else {
      return new Observable((sub) => {
        sub.next(this.filterTree);
        sub.complete();
      });
    }
  }
  /**
   * Sets this.navInfo (not needed, variable not private).
   * @param {Object} info 
   */
  _setNavInfo(info) {
    this.navInfo = info;
  }
  /**
   * Getter for navInfo (not needed, variable not private).
   * @returns {this.navInfo}
   */
  _getNavInfo() {
    return this.navInfo;
  }

  /**
   * Handles filter based on custom filter tree
   * @param filter 
   * @param type 
   * @emits filtered event
   */
  filterItems(filter, type) {
    this.itemsFiltered.next(true);
    this.selectedFilter = { filter, type };
    if (type == 'notFilterTree') {
      let searchString = filter.toLowerCase().split(' ');
      this.selectedFilter = { filter: searchString, type };
    }
    this.filtered.emit(this.selectedFilter);
  }

  // not in use ... 
  /**
   * Unused ...
   * @param filter 
   */
  categoryFilter(filter) {
    this.itemsFiltered.next(true);
    this.selectedFilter = { filter, type: 'tagFilter' }
    this.filtered.emit(this.selectedFilter);
  }

  /**
   * @emits resetFilter event
   */
  resetFilterEmit() {
    this.itemsFiltered.next(false);
    this.selectedFilter = null;
    this.resetFilter.emit(true);
  }

  // also after reload
  /**
   * Sets filter at start of trial and after reload.
   * @param {Array} filters 
   */
  setData(filters) {
    this.filterTree = filters;
  }
}
