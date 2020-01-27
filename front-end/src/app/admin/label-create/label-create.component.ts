import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LabelService } from '../services/label.service';
import { Router } from '@angular/router';
import { ImageDialogComponent } from 'src/app/shared/image-dialog/image-dialog.component';

/**
 * @ignore 
 */
export interface LabelEdit {
  label: any;
  labelForm: FormGroup;
}

/**
 * 
 */
@Component({
  selector: 'app-label-create',
  templateUrl: './label-create.component.html',
  styleUrls: ['./label-create.component.scss']
})
export class LabelCreateComponent implements OnInit {
  /**Object for holding label data. */
  labelEdit: LabelEdit;
  /**Variable names for mat-table column definitions. */
  displayCols = ['_id', 'header', 'description', 'edit']
  /**Switch for showing edit form for label creation. */
  showForm = false;

  /**Datasource for displaying all label in mat-table. */
  dataSource: any;
  /**Switch for displaying mat-table, true if datasource.length > 0. */
  showTable = false;
  /**@ignore */
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private labelService: LabelService,
    private router: Router
  ) { }
  /**
   * OnInit livecycle hook for getting data for display purposes.
   */
  ngOnInit() {
    this.getLabels();
  }
  /**
   * Function for getting all labels asociated with an authenticated user.
   */
  getLabels() {
    this.labelService.getAllMyLabel().subscribe((label) => {
      this.dataSource = label;
      this.showTable = true;
    });
  }
  /**
   * Funciton for setting existing label data to edit form and switching 
   * the visibility switch.
   * @param element 
   */
  editLabel(element) {
    let obj = {
      label: element,
      labelForm: this.fb.group({
        header: [element.header],
        description: [element.description]
      })
    }
    this.labelEdit = obj;
    this.showForm = true;
  }

  /**
   * Function for starting mat-dialog for adding a image to label.
   * @param element 
   */
  addImage(element) {
    const dialogRef = this.dialog.open(ImageDialogComponent, {
      width: '80%',
      data: { ref: 'label', item: element }
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

  /**
   * OnClick listener function for deleting base label.
   * Updating UI elements.
   * @param element 
   */
  deleteLabel(element) {
    this.labelService.deleteSpecificLabel(element._id).subscribe((val) => { });
    this.getLabels();
  }

  /**
   * OnClick listener for starting a new label data edit.
   */
  newLabel() {
    let obj = {
      label: {},
      labelForm: this.fb.group({
        header: [''],
        description: ['']
      })
    }
    this.labelEdit = obj;
    this.showForm = true;
  }

  /**
   * Function for saving label definition to API.
   */
  saveLabelData() {
    let newData = {
      header: this.labelEdit.labelForm.controls.header.value,
      description: this.labelEdit.labelForm.controls.description.value
    }
    Object.assign(this.labelEdit.label, newData);
    if (!this.labelEdit.label._id) {
      this.labelService.saveNewLabel(this.labelEdit.label).subscribe(
        () => {
          this.getLabels();
          this.showForm = false;
        }
      );
    } else {
      this.labelService.updateSpecificLabel(this.labelEdit.label)
    }
  }

  /**@ignore */
  onBack() {
    this.router.navigate(['/admin'])
  }

}
