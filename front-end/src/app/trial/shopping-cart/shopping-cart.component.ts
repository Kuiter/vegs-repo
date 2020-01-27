import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCartService } from './shopping-cart.service';
import { EventsService } from '../trial-services/events.service';
import { environment } from 'src/environments/environment';

/**
 * 
 */
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  @Input() host: string;

  items = this.shoppingCartService.getCart();
  // showCart: boolean;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private eventsService: EventsService
  ) { }

  /**
   * 
   */
  ngOnInit() {
    console.log(this.items);
    // this.showCart = true;
    this.eventsService.emitShowBack(true);
  }
  /**
   * @ignore
   */
  get environment() {
    return environment;
  }

  /**
   * 
   * @param item 
   */
  calculateGrossSum(item) {
    let sum = 0;
    if (item.taxes.length > 0) {
      for (let t of item.taxes) {
        sum += Math.round(item.netPrice * t.amount * 100) / 100;
      }
    }
    sum += item.netPrice;
    sum = Math.round(sum * (1 + item.vat) * 100) / 100;
    return sum;
  }
  /**
   * 
   * @param {Object} item 
   * @param {Number} delta 
   * @param {Number} amount 
   */
  changeItemAmount(item, delta, amount) {
    if (amount >= 1) {
      if (amount + delta > 0) {
        this.shoppingCartService.changeAmountOfItem(item, delta);
      } else if (amount + delta == 0) {
        // this.checkShow();
        this.shoppingCartService.removeItemFromCart(item);
      }
    }
  }
}
