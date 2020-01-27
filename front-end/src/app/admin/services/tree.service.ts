import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

/**
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class TreeService {
  /**Variable for holding all trees recieved from the API. */
  trees = [];
  /**Emitter for databinding to propagate close edit event. */
  closeEdit: EventEmitter<any> = new EventEmitter();
  /**Emitter for databinding to propagate update event. */
  updateFilterList = new EventEmitter();
  /**@ignore */
  constructor(private http: HttpClient) { }
  /**
   * Function for loading all trees from API.
   */
  getAllTrees() {
    return new Observable((sub) => {
      this.http.get(environment.apiURI + '/options/groups/allMyTrees').subscribe(
        (val: any[]) => {
          this.trees = val;
          sub.next(this.trees);
        }
      );
    })
  }
  /**
   * Function for saving filter tree to databse (API).
   * @param tree 
   */
  saveNewFilterTree(tree) {
    return new Observable((sub) => {
      this.http.post(environment.apiURI + '/options/groups/tree', tree).subscribe(
        (val) => {
          this.trees.push(val);
          sub.next(val);
        }
      );
    });
  }

  /**
   * Function for loading a specific tree based on id string.
   * @param {String} id 
   */
  getSpecificTree(id) {
    const ind = this.trees.findIndex(x => x._id == id);
    return new Observable((sub) => {
      if (this.trees.length == 0 || ind == -1) {
        this.getAllTrees().subscribe(
          () => {
            const newInd = this.trees.findIndex(x => x._id == id);
            if (newInd != -1) {
              sub.next(this.trees[newInd]);
            } else {
              sub.error('no matching tree found');
            }
          }
        )
      } else {
        sub.next(this.trees[ind]);
      }
    });
  }

  // only for base trees not in treatment
  /**
   * Function for updating specific tree. Putting changes to tree data to database.
   * @param tree 
   * @returns {Observable}
   */
  updateFilterTree(tree) {
    return new Observable((sub) => {
      this.http.put(environment.apiURI + '/options/groups/tree/' + tree._id, tree).subscribe(
        (val: any) => {
          sub.next(val);
        }
      );
    });
  }
  /**
   * Function specific for updating filter tree definition on a treatment specification.
   * @param treatmentID 
   * @param tree 
   * @returns {Observable}
   */
  updateFilterOnTreatment(treatmentID, tree) {
    return new Observable((sub) => {
      this.http.put(environment.apiURI + '/treatment/' + treatmentID + '/' + tree._id, tree).subscribe(
        (val) => {
          sub.next(val);
        }
      );
    });
  }

  /**
   * Function for propagating filter tree deletion on treatment specification.
   * @param treatmentID 
   * @param treeID 
   * @return {Observable}
   */
  removeFilterFromTreatment(treatmentID, treeID) {
    return this.http.delete(environment.apiURI + '/tree/' + treatmentID + '/' + treeID);
  }

  /**
   * Function for deleting base filter tree information.
   * @param id 
   * @returns {Observable}
   */
  deleteBaseFilter(id) {
    return this.http.delete(environment.apiURI + '/options/groups/tree/' + id);
  }

  /**
   * Function for emitting close editing view.
   * @emits 
   */
  emitCloseEdit() {
    this.closeEdit.emit(true);
  }
  /**
   * Function for emitting update filter list, for databinding purposes.
   * @emits
   */
  emitUpdateFilterList() {
    this.updateFilterList.emit();
  }
}
