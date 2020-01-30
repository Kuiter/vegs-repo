import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../services/item.service';
import { TreatmentService } from '../services/treatment.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ItemAllocateDialogComponent } from '../item-allocate-dialog/item-allocate-dialog.component';
import { LabelService } from '../services/label.service';
import { LabelAllocateDialogComponent } from '../label-allocate-dialog/label-allocate-dialog.component';
import { ScoreService } from '../services/score.service';
import { TaxService } from '../services/tax.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

/**
 * Item create component 
 * 
 * Component script and template for creating and editing base items, also used for editing items allocated to 
 * a specific treament.
 */
@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.scss']
})
export class ItemCreateComponent implements OnInit {
  /**Databinding for emission of close event. Parent switches visibility off for the create component. */
  @Output() close: EventEmitter<any> = new EventEmitter();
  /**Object for holding current item information. */
  itemFormObject: any;
  /**Switch for visibility toggle of edit component template. */
  show = false;
  /**Switch for visibility of item description */
  showDescription = false;
  // showTax = false;
  /**Switch for visibility of item labels */
  showLabel = false;
  /**Switch for visibility of navigation button */
  showNav = false;
  /**Switch for visibility of item scores */
  showScore = false;
  /**Switch for visibility of score form */
  showScoreForm = false;
  /**Switch for visibility of item taxes */
  showTax = false;
  /**Switch for visibility of tax form */
  showTaxForm = false;
  /**Switch for visibility of item swap options */
  showSwaps = false;
  /**Datasource for mat-table for displaying allocated swap options */
  swapItems: any[];
  /**Datasource for mat-table for displaying allocated labels */
  labelItems: any[];
  /**Datasource for mat-table for displaying allocated scores */
  scoreItems: any[];

  // if treatment Edit
  /**Switch for determining if item is beeing edited on treatment or in base item mode. */
  treatmentEdit = false;
  /**Holds reference to the selected item data. */
  selectedItem: any;
  /**Mat-table column definition */
  displayedColumns = ['_id', 'name', 'brand', 'delete'];
  /**Mat-table column definition label*/
  displayedColumnsLabel = ['_id', 'header', 'description', 'delete'];
  /**Mat-table column definition score */
  displayedColumnsScore = ['scoreID', 'header', 'amount', 'delete'];
  /**Mat-table column definition taxes */
  displayedColumnsTax = ['taxID', 'header', 'shortDescription', 'delete'];

  /**Holds base scores for dropdown select */
  scores: any;
  /**Holds base taxes for dropdown select */
  taxes: any;
  /**FormGroup variable for add score form */
  scoreForm: FormGroup;
  /**FormGroup variable for add tax form */
  taxForm: FormGroup;
  /**Datasource for mat-table, for allocated tax display. */
  taxItems: any;

  // for chip list (tags)
  /**Switch for chip list display for associated tags. */
  visible = true;
  /**Switch for selectability on chiplist. */
  selectable = true;
  /**Switch for chip removability. */
  removable = true;
  /**Part of chiplist definition */
  addOnBlur = true;
  /**Part of chiplist definition */
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  /**
   * @ignore
   * @param fb 
   * @param route 
   * @param itemService 
   * @param scoreService 
   * @param router 
   * @param treatmentService 
   * @param dialog 
   * @param labelService 
   * @param taxService 
   */
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private itemService: ItemService,
    private scoreService: ScoreService,
    private router: Router,
    private treatmentService: TreatmentService,
    private dialog: MatDialog,
    private labelService: LabelService,
    private taxService: TaxService
  ) { }
  /**
   * OnInti livecycle hook sets up data for display. Checks if data is present, and if initializes data
   * with their appropriate variables for editing and display purposes.
   */
  ngOnInit() {
    // check if Item edit is chosen
    if (this.route.snapshot.parent.url[0].path == 'treatmentEdit') {
      this.treatmentEdit = true;
      const treatmentID = this.route.snapshot.parent.url[1].path;
      this.route.params.subscribe((param) => {
        this.treatmentService.getSpecificTreatment(treatmentID).subscribe((val: any) => {
          this.selectedItem = val.items.filter((x) => { return x._id == param.itemID })[0];
          // populate form with existing data
          this.populateForms();
          this.swapItems = [];
          // load all specified scores 
          this.scoreService.getAllScores().subscribe(
            (scores) => {
              this.scores = scores;
            },
            (error) => { console.error(error) }
          );
          this.taxService.getAllTaxes().subscribe(
            (taxes: any) => {
              this.taxes = taxes;
            }
          );
          if (this.itemFormObject.taxes.length > 0) {
            this.taxItems = this.itemFormObject.taxes;
            this.showTax = true;
          }
          // check if swap items are available
          if (this.itemFormObject.swaps.length > 0) {
            // get item data from treatment service!
            this.swapItems = this.treatmentService.getItemsOfTreatmentByArray(this.route.snapshot.parent.url[1].path, this.itemFormObject.swaps);
            this.showSwaps = true;
          }
          if (this.itemFormObject.label.length > 0) {
            // get item data from treatment service!
            this.labelService.getLabelByArray(this.itemFormObject.label).subscribe((label: any[]) => {
              this.labelItems = label;
              this.showLabel = true;
            });
          }
          // populate scores
          if (this.itemFormObject.score != undefined) {
            if (this.itemFormObject.score.length > 0) {
              this.scoreItems = this.itemFormObject.score;
              this.showScore = true;
            }
          }
        });
      })
      return;
    }
    // if baseItem edit is selected
    if (this.route.snapshot.parent.data.items) {
      this.route.params.subscribe((param) => {
        let ind = this.route.snapshot.parent.data.items.findIndex(x => x._id == param.itemID);
        this.selectedItem = this.route.snapshot.parent.data.items[ind];
        this.populateForms();
      });
      return;
    }
    this.showNav = true;
    this.populateEmpty()
  }
  /**
   * Refresh UI function for label display.
   * @param label 
   */
  refreshLabelItems(label) {
    this.showLabel = false;
    this.labelItems = null;
    if (label.length > 0) {
      this.labelService.getLabelByArray(label).subscribe((label: any) => {
        this.labelItems = label;
        this.showLabel = true;
      });
    }
  }
  /**
   * Refresh UI funtion for swap display.
   * @param swaps 
   */
  refreshSwapItems(swaps) {
    this.showSwaps = false;
    this.swapItems = null;
    if (swaps.length > 0) {
      this.swapItems = this.treatmentService.getItemsOfTreatmentByArray(this.route.snapshot.parent.url[1].path, swaps);
      this.showSwaps = true;
    }
  }

  /**
   * Refresh UI function for allocated scores.
   * @param scores 
   */
  refreshScoreItems(scores) {
    this.showScore = false;
    this.scoreItems = scores;
    if (this.scoreItems.length < 1) {
      return;
    }
    this.showScore = true;
  }

  /**OnClick listener for deleting swap reference on item. */
  deleteSwap(id) {
    // from swapItems
    const ind = this.swapItems.findIndex(x => x._id == id);
    if (ind == -1) {
      return;
    }
    this.swapItems.splice(ind, 1);
    this.swapItems = this.swapItems;
    const indObj = this.itemFormObject.swaps.indexOf(id);
    if (indObj == -1) {
      return;
    }
    this.itemFormObject.swaps.splice(indObj, 1);
    this.refreshSwapItems(this.itemFormObject.swaps);
  }

  /**
   * OnClick listener for adding a swap item to a item.
   */
  addSwapItems() {
    let treatmentItems = this.treatmentService.getItemsofTreatment(this.route.snapshot.parent.url[1].path);
    const dialogRef = this.dialog.open(ItemAllocateDialogComponent, {
      width: '80%',
      data: {
        itemID: this.itemFormObject._id,
        allItems: treatmentItems,
        selectedItems: this.itemFormObject.swaps,
        ref: 'swap'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.forEach(element => {
          if (this.itemFormObject.swaps.includes(element._id)) { } else {
            this.itemFormObject.swaps.push(element._id);
          }
        });
        this.swapItems = this.treatmentService.getItemsOfTreatmentByArray(this.route.snapshot.parent.url[1].path, this.itemFormObject.swaps);
        this.showSwaps = true;
      }
    });
  }

  /**
   * Onclick listener for close edit display.
   * @emits closeEdit
   */
  closeEdit() {
    this.itemService.emitCloseEdit();
  }

  /**
   * OnClick listener for adding descriptions to an item.
   */
  addDescriptionItem() {
    this.itemFormObject.description.push(
      this.fb.group({
        header: [''],
        text: [''],
      })
    );
    this.showDescription = true;
  }

  /**
   * OnClick listener for deleting label references placed on an item.
   * @param id 
   */
  deleteLabel(id) {
    // from labelItems
    const ind = this.labelItems.findIndex(x => x._id == id);
    if (ind == -1) {
      return;
    }
    this.labelItems.splice(ind, 1);

    // from objecForm
    const indObj = this.itemFormObject.label.indexOf(id);
    if (indObj == -1) {
      // may happen if item not saved.
      return;
    }
    this.itemFormObject.label.splice(indObj, 1);
    this.refreshLabelItems(this.itemFormObject.label);
  }

  /**
   * OnClick listener for adding labels to an existing item either base / or treatment specific.
   */
  addLabel() {
    this.labelService.getAllMyLabel().subscribe((label) => {
      const dialogRef = this.dialog.open(LabelAllocateDialogComponent, {
        width: '80%',
        maxHeight: '90vh',
        data: {
          itemID: this.itemFormObject._id,
          allLabel: label,
          selectedLabel: this.itemFormObject.label,
          ref: 'swap'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          result.forEach(element => {
            if (this.itemFormObject.label.includes(element._id)) { } else {
              this.itemFormObject.label.push(element._id);
            }
          });
          // get exact description of label from treatment of backend if new items always backend
          this.labelService.getLabelByArray(this.itemFormObject.label).subscribe(
            (label: any) => {
              this.labelItems = label;
              this.showLabel = true;
            }
          );
        }
      });
    });
  }

  /**
   * OnClick listener for deleting a score allocated to an item.
   * @param id 
   */
  deleteScore(id) {
    this.itemFormObject.score = {};
    this.refreshScoreItems([]);
  }

  /**
   * OnClick listener for adding a score to an item.
   */
  addScore() {
    this.scoreForm = this.fb.group({
      scoreID: [''],
      amount: []
    });
    this.showScoreForm = true;
  }

  /**
   * OnClick listener for adding taxes to an item. 
   */
  addTax() {
    this.taxForm = this.fb.group({
      taxID: [''],
      amount: []
    });
    this.showTaxForm = true;
  }

  /**
   * Refresh UI representation of allocated taxes function.
   * @param taxes 
   */
  refreshTaxItems(taxes) {
    this.showTax = false;
    this.taxItems = taxes;
    if (this.taxItems.length > 0) {
      this.showTax = true;
    }
  }

  /**
   * OnClick listener for saving tax definitions to an item.
   */
  saveTax() {
    const ind = this.taxes.findIndex(x => x._id == this.taxForm.controls.taxID.value);
    if (ind == -1) {
      return;
    }
    if (!this.itemFormObject.taxes) { this.itemFormObject.taxes = [] }
    this.itemFormObject.taxes.push(
      {
        taxID: this.taxForm.controls.taxID.value,
        header: this.taxes[ind].header,
        description: this.taxes[ind].description,
        shortDescription: this.taxes[ind].shortDescription,
        amount: this.taxForm.controls.amount.value
      }
    );
    this.refreshTaxItems(this.itemFormObject.taxes);
    this.showTaxForm = false;
  }

  /**
   * OnClick listener for deleting tax references on an item.
   * @param tax 
   */
  deleteTax(tax) {
    const ind = this.itemFormObject.taxes.findIndex(x => x.taxID == tax);
    if (ind == -1) {
      return;
    }
    this.itemFormObject.taxes.splice(ind, 1);
    this.refreshTaxItems(this.itemFormObject.taxes);
  }

  /**
   * OnClick listener for saving scores to an item. 
   */
  saveScoers() {
    let ind = this.scores.findIndex(x => x._id == this.scoreForm.controls.scoreID.value);
    if (ind == -1) {
      return;
    }
    this.itemFormObject.score = {
      scoreID: this.scoreForm.controls.scoreID.value,
      amount: this.scoreForm.controls.amount.value
    }
    Object.assign(this.itemFormObject.score, this.scores[ind]);
    this.refreshScoreItems([this.itemFormObject.score]);
    this.showScoreForm = false;
  }

  /**
   * OnClick listener for saving the edited or created item.
   */
  saveItem() {
    let item = {
      _id: '',
      name: this.itemFormObject.data.controls.name.value,
      brand: this.itemFormObject.data.controls.brand.value,
      description: [],
      nutritionalTable: {
        kj: this.itemFormObject.nutritionalTable.controls.kj.value,
        kcal: this.itemFormObject.nutritionalTable.controls.kcal.value,
        totalFat: this.itemFormObject.nutritionalTable.controls.totalFat.value,
        saturatedFat: this.itemFormObject.nutritionalTable.controls.saturatedFat.value,
        totalCarbohydrate: this.itemFormObject.nutritionalTable.controls.totalCarbohydrate.value,
        sugar: this.itemFormObject.nutritionalTable.controls.sugar.value,
        protein: this.itemFormObject.nutritionalTable.controls.protein.value,
        salt: this.itemFormObject.nutritionalTable.controls.salt.value,
      },
      netPrice: this.itemFormObject.data.controls.netPrice.value,
      currency: this.itemFormObject.data.controls.currency.value,
      vat: this.itemFormObject.data.controls.vat.value,
      tax: {
        // steht noch aus wie es implementiert wird
      },
      amount: this.itemFormObject.data.controls.amount.value,
      content: {
        contentType: this.itemFormObject.content.controls.contentType.value,
        amountInKG: this.itemFormObject.content.controls.amountInKG.value,
        displayAmount: this.itemFormObject.content.controls.displayAmount.value,
      },
      images: [],
      ingredients: this.itemFormObject.data.controls.ingredients.value,
      allergens: this.itemFormObject.data.controls.allergens.value,
      score: this.itemFormObject.score,
      swaps: this.itemFormObject.swaps,
      label: this.itemFormObject.label,
      taxes: this.itemFormObject.taxes,
      tags: this.itemFormObject.tags
    };
    if (this.itemFormObject.description.length > 0) {
      this.itemFormObject.description.forEach(d => {
        item.description.push(
          {
            header: d.controls.header.value,
            text: d.controls.text.value,
            // order: d.controls.order.value,
          }
        );
      });
    }
    if (!this.selectedItem) {
      this.itemService.saveNewItem(item).subscribe(
        (item) => {
          if (this.treatmentEdit) {
            this.treatmentService.getAllTreatments().subscribe(() => { });
          }
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      item._id = this.selectedItem._id;
      item.images = this.selectedItem.images;
      if (this.treatmentEdit) {
        this.treatmentService.updateInformationOfItemInTreatment(item).subscribe(
          (val) => {
            this.treatmentService.replaceTreatment(val);
          }
        );
        return;
      }
      this.itemService.saveEditedItem(item).subscribe(
        (item) => { },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  /**
   * Function populate the forms if any existing values are present. 
   * Primarily important for hte case if an item is edited after it has been created.
   */
  populateForms() {
    this.itemFormObject = {
      _id: this.selectedItem._id,
      data: this.fb.group({
        name: [this.selectedItem.name],
        brand: [this.selectedItem.brand],
        currency: [this.selectedItem.currency],
        vat: [this.selectedItem.vat],
        amount: [this.selectedItem.amount],
        ingredients: [this.selectedItem.ingredients],
        allergens: [this.selectedItem.allergens],
        superGroup: [this.selectedItem.superGroup],
        subGroup: [this.selectedItem.subGroup],
        netPrice: [this.selectedItem.netPrice],
        niceness: [this.selectedItem.niceness]
      }),
      nutritionalTable: this.fb.group({
        kj: [this.selectedItem.nutritionalTable.kj],
        kcal: [this.selectedItem.nutritionalTable.kcal],
        totalFat: [this.selectedItem.nutritionalTable.totalFat],
        saturatedFat: [this.selectedItem.nutritionalTable.saturatedFat],
        totalCarbohydrate: [this.selectedItem.nutritionalTable.totalCarbohydrate],
        sugar: [this.selectedItem.nutritionalTable.sugar],
        protein: [this.selectedItem.nutritionalTable.protein],
        salt: [this.selectedItem.nutritionalTable.salt],
        // additionalInformation: [
        //   AdditionalInformationSchema
        // ]
      }),
      content: this.fb.group({
        contentType: [this.selectedItem.content.contentType],
        amountInKG: [this.selectedItem.content.amountInKG],
        displayAmount: [this.selectedItem.content.displayAmount]
      }),
      description: [],
      swaps: this.selectedItem.swaps,
      label: this.selectedItem.label,
      score: this.selectedItem.score,
      taxes: this.selectedItem.taxes,
      tags: this.selectedItem.tags
    }
    // add description items
    if (this.selectedItem.description.length > 0) {
      this.selectedItem.description.forEach(desc => {
        this.itemFormObject.description.push(this.fb.group({
          header: [desc.header],
          text: [desc.text],
        }));
      });
      this.showDescription = true;
    }
    this.show = true;
  }

  /**
   * Function for populating all forms but with the default values, where no values are given.
   */
  populateEmpty() {
    this.itemFormObject = {
      data: this.fb.group({
        name: [''],
        brand: [''],
        currency: ['EUR'],
        vat: [0],
        amount: [],
        ingredients: [''],
        allergens: [''],
        superGroup: [''],
        subGroup: [''],
        netPrice: [],
        niceness: [1]
      }),
      nutritionalTable: this.fb.group({
        kj: [],
        kcal: [],
        totalFat: [],
        saturatedFat: [],
        totalCarbohydrate: [],
        sugar: [],
        protein: [],
        salt: [],
        // additionalInformation: [
        //   AdditionalInformationSchema
        // ]
      }),
      description: [],
      content: this.fb.group({
        contentType: ['solid'],
        amountInKG: [],
        displayAmount: ['g'],
      }),
      score: {},
      swaps: [],
      label: [],
      taxes: [],
      tags: []
    }
    this.show = true;
  }

  /**
   * OnClick listener Mat-chip list specific function for adding tags to the item
   * @param event 
   */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.itemFormObject.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /**
   * OnClick listener Mat-chip list for removing a tag
   * @param tag 
   */
  removeTag(tag: String): void {
    const index = this.itemFormObject.tags.indexOf(tag);

    if (index >= 0) {
      this.itemFormObject.tags.splice(index, 1);
    }
  }
  /**@ignore */
  onBack() {
    this.router.navigate(['/admin']);
  }
}
