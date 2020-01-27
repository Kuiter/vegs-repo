import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { TreeService } from '../services/tree.service';

@Component({
  selector: 'app-filter-allocate-dialog',
  templateUrl: './filter-allocate-dialog.component.html',
  styleUrls: ['./filter-allocate-dialog.component.scss']
})
export class FilterAllocateDialogComponent implements OnInit {

  show = false;
  trees: any[];

  displayedColumns: string[] = ['select', 'ID', 'name', 'description'];

  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);

  /**@ignore */
  constructor(
    public dialogRef: MatDialogRef<FilterAllocateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private treeService: TreeService
  ) { }

  /**@ignore */
  ngOnInit() {
    this.treeService.getAllTrees().subscribe((val: any) => {
      this.trees = val;
      this.refresh();
      if (this.data.filters.length > 0) {
        let refArray = []
        for (let sel of this.data.filters) {
          refArray.push(sel.oldID)
        }
        this.dataSource.data.forEach(row => {
          if (refArray.includes(row._id)) {
            this.selection.select(row);
          }
        })
      }
    })
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

  /**@ignore */
  onSubmit() {
    this.dialogRef.close(this.selection.selected);
  }

  /**
   * @ignore
   */
  refresh() {
    this.dataSource.data = this.trees;
    this.show = true;
  }
}
