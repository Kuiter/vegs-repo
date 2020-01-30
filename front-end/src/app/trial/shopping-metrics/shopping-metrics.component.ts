import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { TrialTreatmentService } from '../trial-services/trial-treatment.service';
import { EventsService } from '../trial-services/events.service';
import { TrialSubjectService } from '../trial-services/trial-subject.service';
import { Router } from '@angular/router';
import { SwapDialogComponent } from '../swap-dialog/swap-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SwapOptDialogComponent } from '../swap-opt-dialog/swap-opt-dialog.component';
import { Subject } from 'rxjs';

/**
 * Shopping Metrics Component
 * 
 * Place for additional shopping cart metrics ...
 * eg.: Nutritional Information etc.
 */
@Component({
  selector: 'app-shopping-metrics',
  templateUrl: './shopping-metrics.component.html',
  styleUrls: ['./shopping-metrics.component.scss']
})
export class ShoppingMetricsComponent implements OnInit {
  /**Holds all items currently in cart and amount of items. */
  items = this.shoppingCartService.getCart();
  /**Switch for displaying sum of items false if no items present. */
  showSum = true;

  /** Subject for iterating all items and possible swap options */
  swapCahin: Subject<any>;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private trialTreatmentService: TrialTreatmentService,
    private eventsService: EventsService,
    private trialSubjectService: TrialSubjectService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    if (this.items.length == 0) { return }
    this.showSum = true;
  }

  /**
   * @return {String} currreny e.g.: EUR... 
   * For the html page.
   */
  get currency() {
    return this.trialTreatmentService.getCurrency();
  }

  get minNumItems() {
    const subjectOptions = this.trialTreatmentService.getSujectOptions();
    if (!subjectOptions) { return 0 }
    return subjectOptions.minAmountOfItemsPurchased ? subjectOptions.minAmountOfItemsPurchased : 0;
  }

  /**
   * 
   * @returns {Number} Sum of Items in shopping cart
   * For html page
   */
  calculateSumOfItems() {
    if (this.items.length == 0) {
      return 0;
    }
    return this.shoppingCartService.calcSumPriceOfItems();
  }
  /**
   * OnClick Checkout Button for "ending trial".
   * Now implemented to redirect to questionnaire part 2.
   */
  async endTrial() {
    const { showSwapEnd, showOptInEachTime, showOptInStart } = this.trialTreatmentService.getSwapConfig();
    const items = [...this.items];
    if (showSwapEnd) {
      if (showOptInStart) {
        const bool = await this.optInDialog(null);
        if (bool) {
          for (let it of items) {
            await this.iterateSwaps(it);
          }
          this.finalCheckOut();
        } else {
          this.finalCheckOut();
        }
      } else if (showOptInEachTime) {
        for (let it of items) {
          if (it.item.swaps.length == 0) {
            continue;
          }
          let bool = !localStorage.getItem('remember') ? null : (localStorage.getItem('remember') == 'true' ? true : false);
          if (bool == null) {
            bool = await this.optInDialog(it)
            if (bool) {
              await this.iterateSwaps(it);
            } else {
              continue;
            }
          } else if (bool) {
            await this.iterateSwaps(it);
          } else if (bool == false) {
            // promiseArray.push(new Promise((resolve, reject) => { resolve() }));
            continue;
          }
        }
        this.finalCheckOut();
      } else {
        // if no opt in Otion is selected
        for (let it of items) {
          if (it.item.swaps.length == 0) { continue }
          await this.iterateSwaps(it);
          // promiseArray.push(new Promise((resolve, reject) => { resolve() }));
        }
        this.finalCheckOut();
      }
    } else {
      this.finalCheckOut();
    }
  }

  finalCheckOut() {
    const subjectID = sessionStorage.getItem('subjectID');
    const treatmentID = sessionStorage.getItem('treatmentID');
    // proceed to questionnaire
    this.eventsService.endShoppingSession(this.shoppingCartService.getCart()).subscribe(
      async (resp) => {
        if (this.trialTreatmentService.treatmentData.questionnaire) {
          this.trialSubjectService.recording = false;
          this.router.navigate([`/t/${treatmentID}/s/${subjectID}/q2`])
        } else {
          const resp = await this.eventsService.endTrial().toPromise();
          this.trialSubjectService.recording = false;
          // route to end
          this.router.navigate([`/t/${treatmentID}/s/${subjectID}/end`]);
        }
      },
      (error) => {
        this.router.navigate([`/t/${treatmentID}/s/${subjectID}/end`]);
        this.trialSubjectService.recording = false;
      }
    )
  }

  async optInDialog(it: any | null): Promise<boolean | null> {
    return new Promise((resolve, reject) => {
      const dialogRef = !it ?
        this.dialog.open(SwapOptDialogComponent, {
          data: { item: it.item },
          maxHeight: '80%',
          maxWidth: '80%',
        })
        : this.dialog.open(SwapOptDialogComponent, {
          data: {},
          maxHeight: '80%',
          maxWidth: '80%',
        })
      dialogRef.afterClosed().subscribe(async (bool) => {
        resolve(bool);
      })
    })
  }

  iterateSwaps(item) {
    return new Promise((resolve, reject) => {
      if (!item.item.swaps) { resolve() } else {
        if (item.item.swaps.length > 0) {
          this.eventsService.$recordEvent.emit(
            {
              event: 'swapStarted',
              data: {
                originalItem: item.item._id,
                originalAmount: item.amount,
                swapOptions: item.item.swaps
              }
            }
          )
          const dialogRef = this.dialog.open(SwapDialogComponent, {
            maxHeight: '80vh',
            width: '80%',
            data: {
              originalItem: item.item._id,
              items: item.item.swaps,
              amount: item.amount
            }
          })

          dialogRef.afterClosed().subscribe((result: any) => {
            if (!result) {
              this.eventsService.$recordEvent.emit(
                {
                  event: 'swapEnded',
                  data: {
                    resultItem: item.item._id,
                    resultAmount: item.amount,
                    success: false
                  }
                }
              )
              this.shoppingCartService.addItemToCart(item, item.amount);
              resolve();
            } else {
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
              this.shoppingCartService.removeItemFromCart(item.item);
              this.shoppingCartService.addItemToCart(result.item, result.amount);
              resolve();
            }
          });
        } else { resolve() }
      }
    });
  }
}
