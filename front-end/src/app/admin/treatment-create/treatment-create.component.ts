import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TreatmentService } from '../services/treatment.service';
import { MatDialog } from '@angular/material/dialog';
import { ItemAllocateDialogComponent } from '../item-allocate-dialog/item-allocate-dialog.component';
import { FilterAllocateDialogComponent } from '../filter-allocate-dialog/filter-allocate-dialog.component';

/**
 * Central Component for handling visual treatment editing.
 */
@Component({
  selector: 'app-treatment-create',
  templateUrl: './treatment-create.component.html',
  styleUrls: ['./treatment-create.component.scss']
})
export class TreatmentCreateComponent implements OnInit {
  /** */
  newTreatment: any;
  /**Base treatment data title and description form. */
  treatmentForm: FormGroup;
  /**Switch for checking if new treatment is created or existing treatment edited. */
  newT = false;
  /**Switch for ? Not used yet*/
  edited = false;
  /**Switch for disabling save button on uploading new treament data. */
  uploading = false;
  /**Switch for visibility of treatmentEdit component, true after necessary data is present. */
  show = false;
  /**@ignore */
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private treatmentService: TreatmentService,
    private dialog: MatDialog
  ) { }
  /**
   * 
   */
  ngOnInit() {
    if (this.activatedRoute.snapshot.data.treatment) {
      this.newTreatment = this.activatedRoute.snapshot.data.treatment;
      if (!this.newTreatment.items) {
        this.newTreatment.items = [];
      }
      if (!this.newTreatment.filters) {
        this.newTreatment.filters = [];
      }
      if (!this.newTreatment.subjectOptions) {
        this.newTreatment.subjectOptions = {
          money: 0,
          restricted: false
        }
      }
      this.treatmentForm = this.fb.group({
        name: [''],
        description: ['']
      })
      this.newT = true;
      this.show = true;
    }
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      console.log('this here');
      this.treatmentService.getSpecificTreatment(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(
        (val) => {
          this.newTreatment = val;
          this.treatmentForm = this.fb.group({
            name: [this.newTreatment.name],
            description: [this.newTreatment.description]
          });
          this.treatmentForm.disable();
          this.uploading = false;
          if (!this.newTreatment.items) {
            this.newTreatment.items = [];
          }
          if (!this.newTreatment.filters) {
            this.newTreatment.filters = [];
          }
          if (!this.newTreatment.subjectOptions) {
            this.newTreatment.subjectOptions = {
              money: 0,
              restricted: false
            }
          }
          this.show = true;
        }
      );
      this.treatmentService.refreshUI.subscribe(() => {
        this.refresh();
      });
    }
  }
  /**
   * OnClick listener function for saving changes on treatment specification.
   */
  saveTreatment() {
    this.uploading = true;
    this.treatmentService.updateSpecificTreatment(this.newTreatment).subscribe(
      (val: any) => {
        if (!this.newT) {
          this.uploading = false;
          return;
        }
        // this.router.navigate(['/admin/treatmentEdit/' + val._id]);
      }
    );
  }

  /**
   * OnClick listener function for saving title and description for treatment.
   */
  saveTreatmentData() {
    this.uploading = true;
    this.newTreatment.name = this.treatmentForm.controls.name.value;
    this.newTreatment.description = this.treatmentForm.controls.description.value;
    this.treatmentService.updateSpecificTreatment(this.newTreatment).subscribe(
      (val: any) => {
        if (!this.newT) {
          this.uploading = false;
          this.treatmentForm.disable();
          return;
        }
        this.router.navigate(['/admin/treatmentEdit/' + val._id]);
      }
    );
  }

  /**
   * OnClick listener function for opening addition dialog type item addition.
   */
  addItems() {
    const dialogRef = this.dialog.open(ItemAllocateDialogComponent, {
      width: '80%',
      maxHeight: '90vh',
      data: {
        treatmentID: this.newTreatment._id,
        items: this.newTreatment.items,
        ref: 'treatment'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.treatmentService.addItemsToTreatment(this.newTreatment._id, result).subscribe(
          (val) => {
            this.treatmentService.replaceTreatment(val);
            this.treatmentService.emitRefreshUI();
          }
        );
      }
    });
  }

  /**
   * OnClick listener function for opening addition dialog type custom filter addition.
   */
  addFilter() {
    const dialogRef = this.dialog.open(FilterAllocateDialogComponent, {
      width: '80%',
      maxHeight: '90vh',
      data: { ref: 'treatment', filters: this.newTreatment.filters }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let promises = [];
        result.forEach((element) => {
          promises.push(
            new Promise((resolve, reject) => {
              this.treatmentService.addFilterToTreatment(this.newTreatment._id, element._id).subscribe(
                (val) => {
                  resolve(val);
                }),
                (error) => { reject(error) }
            })
          );
        });
        Promise.all(promises)
          .then((val: any[]) => {
            val.forEach((element) => {
              this.treatmentService.replaceTreatment(element);
            });
            this.treatmentService.emitRefreshUI();
            this.show = true;
          })
          .catch((val) => { console.error(val) });
      }
    });
  }
  /**
   * OnClick listener for enabling inputs for title and description form.
   */
  editData() {
    this.treatmentForm.enable();
  }
  /**
   * @ignore
   */
  onBack() {
    if (!this.edited && this.newT) {
      this.treatmentService.deleteSpecificTreatment(this.newTreatment._id).subscribe(
        (val) => {
          this.router.navigate(['/admin']);
        }
      );
    } else {
      this.router.navigate(['/admin']);
    }
  }
  /**
   * Function for refresh UI components.
   */
  refresh() {
    this.treatmentService.getSpecificTreatment(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(
      (val: any[]) => {
        this.newTreatment = val;
        this.show = true;
      }
    );
  }
}
