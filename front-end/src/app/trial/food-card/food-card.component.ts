import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SwapDialogComponent } from '../swap-dialog/swap-dialog.component';
import { EventsService } from '../trial-services/events.service';
import { environment } from 'src/environments/environment';
import { TrialTreatmentService } from '../trial-services/trial-treatment.service';
import { SwapOptDialogComponent } from '../swap-opt-dialog/swap-opt-dialog.component';
import { Observable } from 'rxjs';
/**
 * 
 */
@Component({
  selector: 'app-food-card',
  templateUrl: './food-card.component.html',
  styleUrls: ['./food-card.component.scss']
})
export class FoodCardComponent implements OnInit {
  /**Databinding to recieve product information from parent (item-grid) */
  @Input() product: any;
  /**Counter Value displayed on template. */
  counter = 1;

  // showScore = false;
  /**Switch for determining if associated labels should be disiplayd on the card. */
  showLabel = false;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private eventsService: EventsService,
    private trialTreatmentService: TrialTreatmentService
  ) { }
  /**
   * OnInit function to initialize showLabel switch.
   */
  ngOnInit() {
    if (this.product.label.length > 0) {
      this.showLabel = true;
    }
  }
  /**Databinding for template */
  get showScore() {
    return this.trialTreatmentService.getDisplayOptions().showScore;
  }
  /**Function that determins string diplayed for content amount of item.
   * @returns {String}
   */
  displayContentAmount() {
    if (this.product.content.displayAmount == 'g' || this.product.content.displayAmount == 'ml') {
      return `${(this.product.content.amountInKG * 1000).toFixed(0)}`;
    } else if (this.product.content.displayAmount == 'kg' || this.product.content.displayAmount == 'l') {
      return `${(this.product.content.amountInKG)}`;
    }
  }
  /**
   * Function for determining display string for different weights specified.
   * @returns {String}
   */
  conversionGrammagePrice() {
    if (this.product.content.displayAmount == 'kg' || this.product.content.displayAmount == 'l') {
      return `1${this.product.content.displayAmount} = ${((this.product.netPrice / (this.product.content.amountInKG * 1)) * (1 + this.product.vat)).toFixed(2)} €`;
    }
    return `100${this.product.content.displayAmount} = ${((this.product.netPrice / (this.product.content.amountInKG * 10)) * (1 + this.product.vat)).toFixed(2)} €`;
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
  /**Databinding for template */
  get environment() {
    return environment;
  }
  /**Databinding for template */
  get showTax() {
    return this.trialTreatmentService.getDisplayOptions().showTax;
  }

  calculateScore() {
    const max = this.product.score.maxValue;
    const min = this.product.score.minValue;
    const score = (this.product.score.amount - min) / (max - min);
    return `${(1 - score) * 100}%`;
  }
  /**Fucntion for route to details view of specific item. */
  routeToItemDetails(id) {
    this.router.navigate([id], { relativeTo: this.route });
  }
  /**
   * Determins string to display on additional tax information on food card.
   * @returns {String}
   */
  displayTaxDescription() {
    let str = '';
    let i = 0;
    for (let t of this.product.taxes) {
      if (this.product.taxes.length == 1) {
        str = str.concat(t.shortDescription);
      } else if (i == this.product.taxes.length - 1) {
        str = str.concat(t.shortDescription);
      } else {
        str = str.concat(t.shortDescription + ' & ');
      }
      i++;
    }
    return str;
  }
  /**Calculation of tax amount for display in template. 
   * @returns {Number}
  */
  displayAdditionalTaxInfo() {
    let taxes = 0;
    if (this.product.taxes.length > 0) {
      for (let t of this.product.taxes) {
        taxes += Math.round(t.amount * this.product.netPrice * 100) / 100;
      }
    }
    return taxes;
  }
  /**Click listener for add item to shopping cart button on template.
   * @emits $recordEvent
   */
  addToCart() {
    const { showSwaps, showOptInEachTime, showSwapEnd, showOptInStart } = this.trialTreatmentService.getSwapConfig();
    const rememberStart = localStorage.getItem('rememberStart');
    const remember = localStorage.getItem('remember');
    if (showSwaps && this.product.swaps.length > 0) {
      if (!showSwapEnd) {
        if (showOptInEachTime && !remember) {
          const dialogRef = this.dialog.open(SwapOptDialogComponent, {
            data: {item: this.product},
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
      );
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
    })
  }
}