import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { LabelService } from '../services/label.service';

/**
 * Mat-dialog entry component. 
 * Dialog modal for adding labels to a treatment item specification.
 */
@Component({
  selector: 'app-label-allocate-dialog',
  templateUrl: './label-allocate-dialog.component.html',
  styleUrls: ['./label-allocate-dialog.component.scss']
})
export class LabelAllocateDialogComponent implements OnInit {
  /**Switch for triggering visibility of template after data is loaded. */
  show = false;
  /**Stores all labels passed by injected data. */
  label: any[];
  /**Mat-table column definition, variable names. */
  displayedColumns: string[] = ['select', 'ID', 'header', 'description'];
  /**Datasource for mat-table on template. */
  dataSource = new MatTableDataSource<any>();
  /**SelectionModel for Mat-table selection. */
  selection = new SelectionModel<any>(true, []);
  /**@ignore */
  constructor(
    public dialogRef: MatDialogRef<LabelAllocateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private labelService: LabelService
  ) { }
  /**
   * Intializes data for view, and checks if label are already allocated to item.
   */
  ngOnInit() {
    this.label = this.data.allLabel;
    this.refresh();
    this.dataSource.data.forEach((row) => {
      if (this.data.selectedLabel.includes(row._id)) {
        this.selection.select(row);
      }
    });
  }

  /** 
   * Whether the number of selected elements matches the total number of rows. 
   * Mat-table specific.
   * */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** 
   * Selects all rows if they are not all selected; otherwise clear selection. 
   * Mat-table specific.
   * */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** 
   * The label for the checkbox on the passed row 
   * @param {Object} row
   * */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  /**
   * @ignore
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
  /**
   * OnClick listener for submiting label selection for treatment item.
   * @emits seletion.selected
   */
  onSubmit() {
    this.dialogRef.close(this.selection.selected);
  }

  /**Function for refreshing UI components. */
  refresh() {
    this.dataSource.data = this.label;
    this.show = true;
  }
}
