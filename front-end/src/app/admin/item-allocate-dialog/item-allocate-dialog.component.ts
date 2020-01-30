import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ItemService } from '../services/item.service';
import { SelectionModel } from '@angular/cdk/collections';
import { TreatmentService } from '../services/treatment.service';

/**
 * Addition dialog used for Swap, Item, and filter tree. 
 */
@Component({
  selector: 'app-item-allocate-dialog',
  templateUrl: './item-allocate-dialog.component.html',
  styleUrls: ['./item-allocate-dialog.component.scss']
})
export class ItemAllocateDialogComponent implements OnInit {
  /**Switch value for visibility of dialog content, false previous to variable initializaiton. */
  show = false;
  /**Variable for refrencing all items of a treatment. */
  items: any[];
  /**Mat-table column definition variable names. */
  displayedColumns: string[] = ['select', 'ID', 'name', 'brand'];
  /**Datasource for mat-table in template. */
  dataSource: any;
  /**Selection model for seleciton boxes on mat-table. */
  selection = new SelectionModel<any>(true, []);
  /**DOM binding for mat-paginator.  */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageSize = 10;


  /**@ignore */
  constructor(
    public dialogRef: MatDialogRef<ItemAllocateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private itemService: ItemService,
    private treatementService: TreatmentService
  ) { }

  /**
   * OnInit lifecyce hook for data initialization; Initializes differently for
   * Item addition, label addition, or swap addition.
   */
  ngOnInit() {
    if (this.data.ref == 'tree') {
      this.items = this.treatementService.getItemsofTreatment(this.data.treatmentID);
      this.refresh();
      this.dataSource.data.forEach((row) => {
        if (this.data.items.includes(row._id)) {
          this.selection.select(row);
        }
      });
      return;
    }
    if (this.data.ref == 'swap') {
      this.items = this.data.allItems;
      this.refresh();
      return;
    }
    this.itemService.getAllItems().subscribe(
      (val: any[]) => {
        this.items = val;
        this.refresh();
        if (this.data.items.length > 0) {
          let refArray = [];
          this.data.items.forEach(element => {
            refArray.push(element.oldID);
          });
          this.dataSource.data.forEach((row) => {
            if (refArray.includes(row._id)) {
              this.selection.select(row);
            }
          });
          // this.show = true;
        }
      }
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  /**@ignore */
  onNoClick(): void {
    this.dialogRef.close();
  }
  /**
   * OnClick listener function for confirming selection. Emits result to onclose listener. 
   */
  onSubmit() {
    this.dialogRef.close(this.selection.selected);
  }
  /**
   * Function for refreshing the UI components in template.
   */
  refresh() {
    this.dataSource = new MatTableDataSource<Element>();
    this.dataSource.data = this.items;
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.length = this.dataSource.data.length;
    this.iterator(this.paginator.pageIndex, this.paginator.pageSize ? this.paginator.pageSize : 10)

    if (this.data.selectedItems) {
      this.dataSource.data.forEach((row) => {
        if (this.data.selectedItems.includes(row._id)) {
          this.selection.select(row);
        }
      });
    }
  }

  handlePage($event) {
    const currentPage = $event.pageIndex;
    const pageSize = $event.pageSize;
    this.iterator(currentPage, pageSize);
    if (!this.show) {
      this.show = true;
    }

  }

  /**
   * Iterator for handling pagination and slice definition for datasource of mat-table.
   */
  iterator(currentPage, pageSize) {
    const end = (currentPage + 1) * pageSize;
    const start = currentPage * pageSize;
    const part = this.dataSource.data.slice(start, end);
    this.dataSource.slice = part;
    console.log('iterator', this.dataSource.slice);
    this.show = true;
  }
}
