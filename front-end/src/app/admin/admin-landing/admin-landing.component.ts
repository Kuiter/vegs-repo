import { Component, OnInit } from '@angular/core';
import { TreatmentService } from '../services/treatment.service';
import { Router } from '@angular/router';

/**
 * Admin landing component
 * 
 * Combines access to all visual editing features.of the tool. 
 */
@Component({
  selector: 'app-admin-landing',
  templateUrl: './admin-landing.component.html',
  styleUrls: ['./admin-landing.component.scss']
})
export class AdminLandingComponent implements OnInit {
  /**Datasource for mat-table on template. */
  dataSource: any;
  /**Switch for visibiltiy of mat-table in template. */
  showTable = false;
  /**Mat-table column variable defenitions */
  displayedColumns: string[] = ['ID', 'name', 'description', 'edit', 'play'];
  /**
   * @ignore
   * @param treatementService 
   * @param router 
   */
  constructor(
    private treatementService: TreatmentService,
    private router: Router
  ) { }

  /**
   * OnInti livecycle hook, fetching all custom treatments of authenticated user.
   */
  ngOnInit() {
    this.fetchTreatements();
  }
  /**Function for fetching all treatments of authenticated user. */
  fetchTreatements() {
    this.treatementService.getAllTreatments().subscribe(
      (val) => {
        this.dataSource = val;
        this.showTable = true;
      }
    );
    // this.showTable = true;
  }
  /**
   * Function for deleting entire treatment specification.
   * @param element 
   */
  deleteTreatment(element) {
    this.treatementService.deleteSpecificTreatment(element._id).subscribe(() => {
      this.fetchTreatements();
    });
  }

  /**
   * OnClick listener for navigating to selected treatment edit.
   * @param element 
   */
  editTreatment(element) {
    this.router.navigate(['admin/treatmentEdit/' + element._id]);
  }

  async enable(element) {
    try {
      await this.treatementService.enableDisableTreatment(element._id, true).toPromise();
      // change active state
      element.active = true;
    } catch (error) {
      console.error(error);
    }
  }

  async disable(element) {
    try {
      await this.treatementService.enableDisableTreatment(element._id, false).toPromise();
      // change active state
      element.active = true;
    } catch (error) {
      console.error(error);
    }
  }

}
