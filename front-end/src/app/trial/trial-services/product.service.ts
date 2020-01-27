import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Trial Product Service, manages the items associated with a treatment.
 * Serves multiple components.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  /**Holds all products referenced in a given treatment. */
  products: any[];
  /**Holds the filtered selection of items when filters are applied. */
  filteredItems: any;
  /**Holds the subselection either based on this.products or this.filteredItems. */
  subSelection: any;

  constructor(private http: HttpClient) { }

  /**
   * Overwrites central product reference. 
   * @param products 
   */
  resetProducts(products) {
    this.products = products;
  }

  /**
   * Return all products placed into memory.
   * @returns {Observable}
   */
  getAllProducts() {
    return new Observable((sub) => {
      sub.next(this.products);
    })
    // not used anymore
    // return new Observable((sub) => {
    //   const id = sessionStorage.getItem('treatmentID')
    //   if (id) {
    //     this.http.get(environment.apiURI + '/t/' + id).subscribe((val: any[]) => {
    //       this.products = val;
    //       sub.next(this.products);
    //     });
    //   } else {
    //     this.http.get(environment.apiURI + '/allItems').subscribe((val: any[]) => {
    //       this.products = val;
    //       sub.next(this.products);
    //     });
    //   }
    // })
  }
  /**
   * Get specific product from all products based on product._id
   * @param {string} id
   * @returns {Promise} containing product 
   */
  getProduct(id: string): Promise<any> {
    // if not moliciously used id is noever not in this.pruducts
    return new Promise((resolve, reject) => {
      resolve(this.products.find(item => item._id === id));
    });
  }

  /**
   * Called by item grid if displayed items are filtered.
   * 
   * possible filter types: 'filterTree', 'tagFilter', 'limitSelection'
   * - filterTree filters by array of productIDs /itemIDs.
   * - tagFilter filters by tag specification (product.tags contains selected tag).
   * - limitSelection checks if already a filtered selection and subselects based on item.baseAttributes contains string.
   * 
   * @param {Array} filter 
   * @param {string} type
   * @returns {Array} of items representing a subset of all products matching filter. 
   */
  getItemsBasedOnFilter(filter: any, type) {
    if (type == 'filterTree') {
      this.filteredItems = [];
      filter.forEach(filterItem => {
        this.filteredItems.push(
          // checks for old IDs and the product ids ... maybe sometimes items twice or included that should not be
          this.products.filter(x => (x._id == filterItem || x.oldID == filterItem || x.externalID == filterItem))[0]
        );
      });
    } else if (type == 'tagFilter') {
      this.filteredItems = [];
      this.products.forEach((item) => {
        if (item.tags.includes(filter)) {
          this.filteredItems.push(item);
        }
      })
    } else if (type == 'limitSelection') {
      this.subSelection = [];
      if (!this.filteredItems) { this.filteredItems = [...this.products] }
      this.filteredItems.forEach(element => {
        if (element.baseAttributes != null && element.baseAttributes.some(val => filter.includes(val))) {
          this.subSelection.push(element);
        }
      });
      return this.subSelection;
    } else {
      // free text search filter
      this.filteredItems = [];
      this.products.forEach((item) => {
        // for name and brand?
        filter.forEach(word => {
          if (item.name.toLowerCase().includes(word) || item.brand.toLowerCase().includes(word)) {
            this.filteredItems.push(item);
          }
        });
      });
    }
    return this.filteredItems;
  }

  /**
   * Base Function: Generates Filter based on tags array on products.
   * 
   * For this to work there need to be items with a tag array (product.tags representing categories).
   * Tags / categories in this array must be sorted from general to specific.
   * Now only supports tag sorting generation two levels deep.
   * e.g.: ['Lebenmittel', 'Brot', 'Vollkorn'] only first two entries would be selectable and visible in filter component.
   */
  getTreeOfTagsOfAllProducts() {
    if (this.products) {
      let mokData = [];
      for (let p of this.products) {
        if (p.tags.length > 0) {
          mokData.push(p.tags);
        }
      }
      let trees = [];
      let branches = [];
      for (let mok of mokData) {
        for (let i = 0; i < mok.length; i++) {
          let obj: any = { name: mok[i] }
          if (i == 0) {
            obj.parent = null;
          } else {
            obj.parent = mok[i - 1];
          }
          if (branches.findIndex(x => x.name == obj.name) == -1) {
            branches.push(obj);
          }
        }
      }
      // build root:
      const refArray = [...branches];
      branches.forEach((element, index) => {
        if (!element.parent) {
          trees.push({ name: element.name, children: [] });
          branches.splice(index, 1);
        }
      });
      branches.forEach((element, index) => {
        const ind = trees.findIndex(x => x.name == element.parent)
        if (ind != -1) {
          trees[ind].children.push({ name: element.name, children: [] });
          branches.splice(index, 1);
        }
      })
      return trees;
    }
  }

  /**
   * Base Funtion: Limit selection based on baseAttributes of items / products.
   * 
   * Gets all products.baseAttributes in a set (no duplicate entries).
   * @returns {array<string>} of strings 
   */
  getBaseAttributes() {
    let baseAttributes = new Set();
    for (let p of this.products) {
      if (p.baseAttributes != null && p.baseAttributes.length > 0) {
        for (let attr of p.baseAttributes) {
          baseAttributes.add(attr);
        }
      }
    }
    return [...baseAttributes];
  }
}
