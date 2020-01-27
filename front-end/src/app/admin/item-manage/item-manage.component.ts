import { Component, OnInit, Input, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ImageDialogComponent } from 'src/app/shared/image-dialog/image-dialog.component';
import { TreatmentService } from '../services/treatment.service';
import { ItemService } from '../services/item.service';

/**
 * Item manage component. 
 * Handles base item creation and edit, and edit of items saved to a treatment.
 */
@Component({
  selector: 'app-item-manage',
  templateUrl: './item-manage.component.html',
  styleUrls: ['./item-manage.component.scss']
})
export class ItemManageComponent implements OnInit {
  /**Databinding input for treatment specification. */
  @Input('treatment') set Treatment(treatment: any) {
    this.treatment = treatment;
    this.items = treatment.items;
  };

  // paginator 
  /**DOM binding for mat-paginator.  */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /**Variable that controls the pagesize of paginator. */
  pageSize: number = 25;
  /**Variable for current page reference. */
  currentPage = 0;
  /**Datasource for mat-table on template. */
  dataSource: any;
  /**Holds treatment data for use in component script. */
  treatment: any;
  /**Variable holds treatment specific items. */
  items: any[];
  /**Switch for changing visibility if all data is loaded. */
  show = false;
  /**Databinding emitter for ending edit of specific item. */
  closeEditEmitter: any;
  /**Switch for displaying back button only on base item edit / creation */
  showNav = true;
  /**Switch for signigfyong if item that is edited is a treatment specific item. */
  editTreatmentItem = false;
  /**Variable names for mat-table column definition. */
  displayCols = ['_id', 'brand', 'name', 'edit'];

  /**@ignore */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private treatmentService: TreatmentService,
    private itemService: ItemService
  ) { }
  /**
   * 
   */
  ngOnInit() {
    if (!this.route.snapshot.data.items) {
      this.items = this.treatment.items;
      this.showNav = false;
      this.editTreatmentItem = true;
    } else {
      this.items = this.route.snapshot.data.items;
    }
    this.closeEditEmitter = this.itemService.closeEdit.subscribe(() => {
      this.router.navigate([{ outlets: { itemOutlet: null } }], { relativeTo: this.route });
    });
    this.setUp();
  }
  /**
   * 
   */
  setUp() {
    this.dataSource = new MatTableDataSource<Element>();
    this.dataSource.data = this.items;
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.length = this.dataSource.data.length;
    this.iterator();
    this.show = true;
  }
  /**
   * Mat-pagination handler function.
   * @param event 
   */
  handlePage(event) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.iterator();
    if (!this.show) {
      this.show = true;
    }
  }

  /**
   * Iterator for handling pagination and slice definition for datasource of mat-table.
   */
  iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.dataSource.data.slice(start, end);
    this.dataSource.slice = part;
  }

  // get items() { return this.route.snapshot.data.items }
  /**
   * OnClick listener starting edit of an item (base Item or treatment item).
   * @param row 
   */
  editItem(row) {
    if (this.editTreatmentItem) {
      this.router.navigate([{ outlets: { itemOutlet: 'editItem/' + row._id } }], { relativeTo: this.route });
      return;
    }
    this.router.navigate([{ outlets: { itemOutlet: 'baseEdit/' + row._id } }], { relativeTo: this.route });
  }
  /**
   * Funciton that starts dialog for adding image to an item.
   * @param item 
   */
  addImage(item): void {
    const dialogRef = this.dialog.open(ImageDialogComponent, {
      width: '80%',
      data: { ref: 'item', item: item }
    });

    dialogRef.afterClosed().subscribe(result => { });
  }
  /**
   * OnClick listener for deleting base item / treatment item.
   * @param element 
   */
  deleteItem(element) {
    const id = element._id;
    if (!this.editTreatmentItem) {
      this.itemService.deleteBaseItem(id).subscribe(() => {
        this.items.splice(this.items.findIndex(x => x._id == id), 1);
      });
      // return;
    } else {
      this.treatmentService.removeItemFromTreatment(this.treatment._id, element._id).subscribe(
        (val) => {
          this.treatmentService.replaceTreatment(val);
          this.treatmentService.emitRefreshUI();
        },
        (error) => { console.error(error) }
      );
    }
  }
  /**
   * @ignore
   */
  onBack() {
    this.router.navigate(['/admin']);
  }
}
