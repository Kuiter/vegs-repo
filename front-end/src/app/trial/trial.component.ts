import { Component, OnInit, AfterViewInit, AfterContentChecked, HostListener, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { TrialTreatmentService } from './trial-services/trial-treatment.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventsService } from './trial-services/events.service';
import { Location } from '@angular/common';
import { ShoppingCartService } from './shopping-cart/shopping-cart.service';
import { FilterService } from './trial-services/filter.service';
import { TrialSubjectService } from './trial-services/trial-subject.service';
import { MatDialog } from '@angular/material/dialog';
import { SwapOptDialogComponent } from './swap-opt-dialog/swap-opt-dialog.component';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';

/**
 * Trial component
 * 
 * This is the first component that is loaded if any routes with /t/<treatementID>/s/<subjectID>/...
 * is loaded. Here data for the subject and treatment are initialized and reinitilized if the subject
 * reloads the page.
 */

@Component({
  selector: 'app-trial',
  templateUrl: './trial.component.html',
  styleUrls: ['./trial.component.scss']
})
export class TrialComponent implements OnInit, AfterViewInit {

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  innerWidth: any = window.innerWidth;

  /**
   * Switch for displaying the entire trial component.
   * Can be false if trial already ended.  
   */
  show = false;
  /**Switch for diplaying remainder of budget */
  showRemainder = false;
  /**switch for diplaying nav button back. */
  showBack: boolean;
  /**Switch for displaying either search or close button on free text search. */
  get filtered() {
    return this.filterService.itemsFiltered;
  }
  /**FormGroup for free text search */
  searchForm: FormGroup = new FormGroup({
    search: new FormControl('', Validators.required)
  })

  constructor(
    private activatedRoute: ActivatedRoute,
    private trialTreatmentService: TrialTreatmentService,
    private shoppingCartService: ShoppingCartService,
    private router: Router,
    private eventsService: EventsService,
    private location: Location,
    private filterService: FilterService,
    private trialSubjectService: TrialSubjectService,
    private dialog: MatDialog,
  ) { }

  /**
   * On Init retrieves the treatment data from router resolver, 
   * sets subjectID using service, 
   * sets treatment data on first load and reload in trialTreatmentService and session store,
   * checks if subject is subjectID = 0, in which case no recording, else check if trial has already ended
   * and then sets the visibility of the shop accordingly,
   * subscribes to shoping show remainder calculation to update display.  
   */
  ngOnInit() {
    let t = this.activatedRoute.snapshot.data.treatment;
    this.trialSubjectService.setSubjectID(this.activatedRoute.snapshot.paramMap.get('subjectID'))
    // sessionStorage.setItem('subjectID', );
    if (t) {
      sessionStorage.setItem('treatmentID', t._id);
      this.setDataOnReload();
    }
    if (this.trialSubjectService.getSubjectID() == '0') {
      this.show = true;
    } else {
      this.trialSubjectService.checkDataRecording(t._id, this.trialSubjectService.getSubjectID()).subscribe((val: boolean) => {
        this.show = val;
      })
    }
    this.shoppingCartService.showRemainder.subscribe((val) => {
      this.showRemainder = val;
    })
    this.filterService.resetFilter.subscribe(() => {
      this.searchForm.reset();
      // this.showSearchIcon = true;
      this.eventsService.recordFilterEvents({ filter: 'reset', type: 'general' });
    })
    this.filterService.filtered.subscribe((filter) => {
      this.eventsService.recordFilterEvents(filter);
    })
  }

  /**
   * @returns {number} The Sum of all items in the shopping cart
   */
  get sumCart() {
    return this.shoppingCartService.calcSumPriceOfItems();
  }

  /**
   * @returns {string} The currency specified in the treatment
   */
  get currency() {
    return this.trialTreatmentService.getCurrency();
  }

  /**Provides length of cart array to button badge on shopping cart button.
   * @returns {Number}
   */
  get numberOfItems() {
    return !this.shoppingCartService.cart ? 0 : this.shoppingCartService.cart.length;
  }

  /**
   * @returns {boolean} The specified display option for show shopping cart sum
   */
  get showSum() {
    return this.trialTreatmentService.getDisplayOptions().showSum;
  }

  /**
   * @returns {boolean} The specified display option for show budget of subject
   */
  get showBudget() {
    return this.trialTreatmentService.getDisplayOptions().showBudget;
  }

  /**
   * @returns {number} The specified budget amount, specified in the treatment configurations
   */
  get budget() {
    return this.trialTreatmentService.treatmentData.subjectOptions.money;
  }

  /**
   * @returns {number} The remaining budget (budget - cart sum)
   */
  get remainder() {
    return this.trialTreatmentService.treatmentData.subjectOptions.money - this.shoppingCartService.calcSumPriceOfItems();
  }

  /**
   * returns if a popover shopping cart should be displayed
   */
  get showPopOverCart() {
    // return true;
    const url: string = this.router.url;
    return this.trialTreatmentService.getDisplayOptions().showPopOverCart && !url.includes('/cart') && this.numberOfItems > 0;
  }

  /**
   * @ignore
   */
  ngAfterViewInit() {
    this.eventsService.showBack.subscribe((bool) => {
      window.setTimeout(() => {
        this.showBack = bool;
      });
    });
    const { showSwaps, showOptInStart } = this.trialTreatmentService.getSwapConfig();
    if (showSwaps && showOptInStart && !localStorage.getItem('rememberStart')) {
      this.dialog.open(SwapOptDialogComponent, {
        data: {},
        maxHeight: '80%',
        maxWidth: '80%',
      })
    }
  }

  /**
   * OnClick listner for free text search bar. 
   * Switches diplayed icon from search to close, 
   * emits filter event,
   * if not already on products page navigates there.
   */
  onSearch() {
    if (!this.searchForm.controls.search.value) { return }
    // this.showSearchIcon = false;
    this.filterService.filterItems(this.searchForm.controls.search.value, 'notFilterTree')
    // when not on products page navigate there?
    if (!this.router.routerState.snapshot.url.includes('products')) {
      this.router.navigate(['products'], { relativeTo: this.activatedRoute })
    };
  }

  /**
   * OnClick listener for cancel search free text search field. 
   * Deletes user input, emits 
   * reset filter event,
   * and switches icon displayed from close to search.
   */
  cancelSearch() {
    // this.searchForm.reset();
    // const filter = { filter: 'reset', type: 'general' }
    // this.eventsService.recordSorting(filter);
    this.filterService.resetFilterEmit();
  }

  /**
   * Handels treamtment data set up before page is displayed.
   */
  async setDataOnReload() {
    if (this.trialSubjectService.getSubjectID() != '0') {
      try {
        await this.trialTreatmentService.checkIfTreatmentActive(this.trialTreatmentService.getTreatmentID()).toPromise();
        this.trialTreatmentService.setTreatmentDataOnReload(this.activatedRoute.snapshot.data.treatment);
      } catch (error) {
        this.router.navigate(['/inactive'])
      }
    } else {
      this.trialTreatmentService.setTreatmentDataOnReload(this.activatedRoute.snapshot.data.treatment);
    }
  }

  /**
   * OnClick listener for route to shopping cart button. 
   * Emits show back event, for displaying arrow back for navigation, 
   * 
   */
  routeShoppingCart() {
    this.eventsService.emitShowBack(true);
    this.router.navigate(['/t/' + this.trialTreatmentService.getTreatmentID() + '/s/' + this.trialSubjectService.getSubjectID() + '/shop/cart']);
    return;

  }

  /**
   * Onclick listener for back arrow, navigates back using location back.
   */
  navBack() {
    this.eventsService.emitShowBack(false);
    this.location.back();
  }

}
