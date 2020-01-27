import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ProductService } from '../trial-services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../trial-services/events.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TrialLabelService } from '../trial-services/trial-label.service';
import { Observable } from 'rxjs';
import { SwapDialogComponent } from '../swap-dialog/swap-dialog.component';
import { environment } from 'src/environments/environment';
import { TrialTreatmentService } from '../trial-services/trial-treatment.service';
import { SwapOptDialogComponent } from '../swap-opt-dialog/swap-opt-dialog.component';
/**
 * Food Details Component
 * 
 * Displays detail information saved to a individual product.
 * - Nutritional information
 * - product details
 * - Labels
 * - Score
 * - Image
 * ...
 */
@Component({
  selector: 'app-food-details',
  templateUrl: './food-details.component.html',
  styleUrls: ['./food-details.component.scss']
})
export class FoodDetailsComponent implements OnInit, AfterViewInit {
  /** */
  param: any;
  show = false;
  showLabel = false;
  // showScore = false;
  product: any;
  counter = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private eventsService: EventsService,
    private shoppingCartService: ShoppingCartService,
    private dialog: MatDialog,
    private trialLabelService: TrialLabelService,
    private trialTreatmentService: TrialTreatmentService
  ) { }

  ngOnInit() {
    // this.eventsService.emitShowBack(true);
    this.route.params.subscribe(
      res => {
        this.param = res.id;
        this.productService.getProduct(this.param)
          .then((item) => {
            if (item == undefined) {
              this.router.navigate(['/shop']);
              return;
            }
            this.product = item;
            if (item.label.length > 0) {
              this.showLabel = true;
            }
            this.show = true;
          })
          .catch(() => {
            this.router.navigate(['/shop']);
          });
      }
    );
  }
  /**@ignore */
  get environment() {
    return environment;
  }
  /**Databinding to template */
  get showScore() {
    return this.trialTreatmentService.getDisplayOptions().showScore;
  }
  /**Databinding to template */
  get showTax() {
    return this.trialTreatmentService.getDisplayOptions().showTax;
  }
  /**Calculation of tax amount for display in template. 
   * @returns {Number}
  */
  displayAdditionalTaxInfo() {
    let taxes = 0;
    if (this.product.taxes.length > 0) {
      for (let t of this.product.taxes) {
        taxes += t.amount * this.product.netPrice;
      }
    }
    return taxes;
  }
  /**
   * Calculates score for display in template.
   * @returns {String}
   */
  calculateScore() {
    const max = this.product.score.maxValue;
    const min = this.product.score.minValue;
    const score = (this.product.score.amount - min) / (max - min);
    return `${(1 - score) * 100}%`;
  }
  /**
   * Starts Mat-Dialog for additional iformation about displayed Labels.
   * @param labelID 
   * @emits $recordEvent
   */
  showInfo(labelID) {
    let obs = new Observable<any>((sub) => {
      this.trialLabelService.getLabelByID(labelID).subscribe(
        (labelData) => {
          const dialogRef = this.dialog.open(InfoDialogComponent, {
            maxHeight: '80vh',
            width: '80%',
            data: {
              object: labelData,
            }
          });
          sub.next(dialogRef);
        },
        (error) => {
          sub.error(error);
        }
      );
    })
    obs.subscribe((dialogRef) => {
      let t = new Date().toISOString();
      this.eventsService.$recordEvent.emit(
        {
          event: 'labelInfoOpened',
          data: {
            infoID: labelID,
            started: t
          }
        }
      )
      dialogRef.afterClosed().subscribe(result => {
        let t = new Date().toISOString();
        this.eventsService.$recordEvent.emit(
          {
            event: 'labelInfoClosed',
            data: {
              infoID: labelID,
              ended: t
            }
          }
        )
      })
    });
  }
  /**
   * Starts show Mat-Dialog for additional tax info.
   * @todo not implemented...
   */
  showTaxInfo() {
    // record info viewed
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      maxHeight: '80vh',
      width: '80%',
      data: {
        taxes: this.product.taxes,
      }
    });
    dialogRef.afterClosed().subscribe(() => { })
  }
  /**Workaround for template edited after diplayed warning */
  ngAfterViewInit() {
    // work around for reload on food details showBack
    setTimeout(() => {
      this.eventsService.emitShowBack(true);
    }, 1)
  }
  /**Click listener for + button in template. */
  add() {
    this.counter += 1;
  }
  /**Click listener for - button in template. */
  remove() {
    if (this.counter > 1) {
      this.counter -= 1;
    }
  }
  /**Click listener for add item to shopping cart button on template.
   * @emits $recordEvent
   */
  addToCart(): void {
    const { showSwaps, showOptInEachTime, showSwapEnd, showOptInStart } = this.trialTreatmentService.getSwapConfig();
    const rememberStart = localStorage.getItem('rememberStart');
    const remember = localStorage.getItem('remember');
    if (showSwaps && this.product.swaps.length > 0) {
      if (!showSwapEnd) {
        if (showOptInEachTime && !remember) {
          const dialogRef = this.dialog.open(SwapOptDialogComponent, {
            data: { item: this.product },
            maxHeight: '80%',
            maxWidth: '80%'
          })
          dialogRef.afterClosed().subscribe(
            (bool) => {
              if (bool) {
                this.swapDialog().subscribe(
                  () => { }
                )
              } else {
                this.shoppingCartService.addItemToCart(this.product, this.counter);
              }
            }
          )
        } else if (showOptInEachTime && remember == 'true') {
          this.swapDialog().subscribe(() => { })
        } else if (showOptInStart && rememberStart == 'true') {
          this.swapDialog().subscribe(() => { })
        } else if (showSwaps && !showSwapEnd && !showOptInStart && !showOptInEachTime) {
          this.swapDialog().subscribe(
            () => { }
          )
        } else {
          this.shoppingCartService.addItemToCart(this.product, this.counter);
        }
      } else if (showSwapEnd) {
        this.shoppingCartService.addItemToCart(this.product, this.counter);
      }
    } else {
      this.shoppingCartService.addItemToCart(this.product, this.counter);
    }
  }

  swapDialog() {
    return new Observable((sub) => {
      this.eventsService.$recordEvent.emit(
        {
          event: 'swapStarted',
          data: {
            originalItem: this.product._id,
            originalAmount: this.counter,
            swapOptions: this.product.swaps
          }
        }
      )
      const dialogRef = this.dialog.open(SwapDialogComponent, {
        maxHeight: '80vh',
        width: '80%',
        data: {
          originalItem: this.product._id,
          items: this.product.swaps,
          amount: this.counter
        }
      })

      dialogRef.afterClosed().subscribe((result: any) => {
        if (!result) {
          this.eventsService.$recordEvent.emit(
            {
              event: 'swapEnded',
              data: {
                resultItem: this.product._id,
                resultAmount: this.counter,
                success: false
              }
            }
          )
          this.shoppingCartService.addItemToCart(this.product, this.counter);
          sub.next();
          sub.complete();
        }
        this.eventsService.$recordEvent.emit(
          {
            event: 'swapEnded',
            data: {
              resultItem: result.item._id,
              resultAmount: result.amount,
              success: true
            }
          }
        )
        this.shoppingCartService.addItemToCart(result.item, result.amount);
        sub.next();
        sub.complete();
      });
    });
  }
}
