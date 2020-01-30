import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TreatmentService } from '../services/treatment.service';
import { TreeService } from '../services/tree.service';

/**
 * Handles the allocation of filter trees to the treatment specification.
 */
@Component({
  selector: 'app-tree-manage',
  templateUrl: './tree-manage.component.html',
  styleUrls: ['./tree-manage.component.scss']
})
export class TreeManageComponent implements OnInit {

  /**Mat-table column variable names. */
  displayCols = ['_id', 'name', 'description', 'edit'];
  /**Variable for holding all baseTrees that can be allocated to a treatment. */
  trees: any[];
  /**Switch checks if this component is used in the treatment edit view or the base creation view. */
  treatmentEdit = false;
  /**Weitch for showing back button on base tree creation view. */
  showNav = true;
  /**Trigger visibility after data load. */
  show = false;

  /**@ignore */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private treatementService: TreatmentService,
    private treeService: TreeService
  ) { }
  /**
   * OnInit Livecycle hook, start subsciptions for databinding.
   * Checks if treatment edit view is displayed or base edit view. 
   */
  ngOnInit() {
    this.treeService.closeEdit.subscribe(() => {
      this.router.navigate([{ outlets: { treeOutlet: null } }], { relativeTo: this.route });
    });
    this.treeService.updateFilterList.subscribe(() => {
      this.getTrees();
      this.router.navigate([{ outlets: { treeOutlet: null } }], { relativeTo: this.route });
    })
    if (this.route.snapshot.url[0].path == 'treatmentEdit') {
      this.showNav = false;
      this.treatmentEdit = true;
      this.treatementService.getSpecificTreatment(this.route.snapshot.url[1].path)
        .subscribe((val: any) => {
          this.trees = val.filters;
          this.show = true;
        });
      this.treatementService.refreshUI.subscribe(() => {
        this.refresh();
      })
      return;
    }
    this.getTrees();
  }
  /**
   * Function for loading filter-trees from API.
   */
  getTrees() {
    this.show = false;
    this.treeService.getAllTrees().subscribe(
      (val: any[]) => {
        this.trees = val;
        this.show = true;
      }
    )
  }
  /**
   * OnClick listener for starting data edit of a filter tree, 
   * navigates based on if treamentEdit true or false.
   * @param element 
   */
  editTree(element) {
    if (this.treatmentEdit) {
      this.router.navigate([{ outlets: { treeOutlet: 'editFilter/' + element._id } }], { relativeTo: this.route });
      return;
    }
    this.router.navigate([{ outlets: { treeOutlet: 'edit/' + element._id } }], { relativeTo: this.route });
  }
  /**
   * OnClick listener for handling tree deletion. 
   * Either base tree deletion or deleting filter tree from treatment.
   * @param element 
   */
  deleteTree(element) {
    if (this.treatmentEdit) {
      this.treeService.removeFilterFromTreatment(this.route.snapshot.url[1].path, element._id).subscribe(
        (val) => {
          this.treatementService.replaceTreatment(val);
          this.refresh();
        },
        (error) => { console.error(error) }
      );
    } else {
      this.treeService.deleteBaseFilter(element._id).subscribe(
        (val) => {
          this.getTrees();
        }
      )
    }
  }
  /**
   * OnClick listener for creating a new tree.
   */
  newTree() {
    this.router.navigate([{ outlets: { treeOutlet: 'new' } }], { relativeTo: this.route });
  }
  /**@ignore */
  onBack() {
    this.router.navigate(['/admin']);
  }
  /**
   * Function for refreshing the ui elements.
   */
  refresh() {
    if (this.treatmentEdit) {
      this.treatementService.getSpecificTreatment(this.route.snapshot.url[1].path)
        .subscribe((val: any) => {
          if (val.filters == undefined) {

          } else {
            this.trees = val.filters;
          }
          this.show = true;
        });
    } else {
      this.getTrees();
    }
  }

}
