import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../trial-services/product.service';
import { environment } from 'src/environments/environment';

/**
 * Swap Component
 * 
 * Mat Dialog that displays a swap option.
 */
@Component({
  selector: 'app-swap-dialog',
  templateUrl: './swap-dialog.component.html',
  styleUrls: ['./swap-dialog.component.scss']
})
export class SwapDialogComponent implements OnInit {
  /**Holds all specified swap items displayed. Used for ngFor display each item. */
  items: any = [];
  /**Holds reference for originally selected item */
  originalItem: any;
  /**Switch for displaying grid, only true after data is present. */
  showGrid = false;

  constructor(
    public dialogRef: MatDialogRef<SwapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService
  ) { }

  /**
   * Set up the items array for displaying all swap options for an item.
   * The swap options are stored in an array on an item as itemID ref. 
   * Based on these the productService returns all items that are referenced.
   */
  ngOnInit() {
    this.originalItem = this.productService.getItemsBasedOnFilter([this.data.originalItem], 'filterTree');
    let items = this.productService.getItemsBasedOnFilter(this.data.items, 'filterTree');
    items.forEach(element => {
      this.items.push({
        item: element,
        amount: this.data.amount
      })
    });
    this.showGrid = true;
  }

  /**
   * @ignore
   */
  get environment() {
    return environment;
  }

  /**
   * On Click listener that handles item amount changes in this.items.
   * @param {Object} item 
   * @param {Number} delta 
   * @param {Number} amount 
   */
  changeItemAmount(item, delta, amount) {
    if (amount >= 1) {
      if (amount + delta > 0) {
        item.amount += delta;
      }
    }
  }

  /**
   * @ignore
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * OnClick Function that propagetes the result of the swap option to 
   * the components from where its called.
   * @param item 
   * @param amount 
   */
  onSubmit(item, amount): void {
    this.dialogRef.close({ amount: amount, item: item });
  }
}
