import { Component, OnInit } from '@angular/core';
import { TaxService } from '../services/tax.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * Component for handling tax creation and editing.
 */
@Component({
  selector: 'app-tax-create',
  templateUrl: './tax-create.component.html',
  styleUrls: ['./tax-create.component.scss']
})
export class TaxCreateComponent implements OnInit {
  /**
   * Empty object for holding tax object.
   */
  tax: any = {};
  /**
   * Holds all created taxes, for display purposes in mat-table.
   */
  dataSource = [];
  /** */
  showCreate = false;
  /** */
  showTable = false;
  /**Mat-table variable descriptions for column definition. */
  displayCols = ['_id', 'header', 'description', 'edit']

  /**@ignore */
  constructor(
    private taxService: TaxService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  /**
   * OnInit livecycle hook, initiates recieving tax data.
   */
  ngOnInit() {
    this.getTaxes();
  }
  /**
   * Function for loading all base taxes.
   */
  getTaxes() {
    this.taxService.getAllTaxes()
      .subscribe((val: any) => {
        this.dataSource = val;
      });
    this.showTable = true;
  }
  /**
   * OnClick listener for editing a specific tax definition.
   * @param tax 
   */
  editTax(tax) {
    this.tax.data = tax;
    this.tax.form = this.fb.group({
      header: [tax.header],
      description: [tax.description],
      shortDescription: [tax.shortDescription]
    })
    this.showCreate = true;
  }
  /**
   * OnClick listener for adding new tax.
   */
  newTax() {
    this.tax.data = {};
    this.tax.form = this.fb.group({
      header: [''],
      description: [''],
      shortDescription: ['']
    })
    this.showCreate = true;
  }
  /**
   * OnClick listener for saving tax definition either new or edited tax.
   */
  saveTax() {
    let taxData = this.tax.form.value;
    if (Object.entries(this.tax.data).length === 0) {
      Object.assign(this.tax.data, taxData);
      this.taxService.saveNewTax(this.tax.data)
        .subscribe((val) => {
          this.getTaxes();
          this.showCreate = false;
        });
    } else {
      Object.assign(this.tax.data, taxData);
      this.taxService.updateTaxInformation(this.tax.data).subscribe(
        (tax) => {
          this.getTaxes();
          this.showCreate = false;
        }
      )
    }
  }
  /**
   * OnClick listener for deleting base tax.
   * Not implemented...
   */
  deleteTax() {

  }
  /**@ignore */
  onBack() {
    this.router.navigate(['/admin']);
  }
}
