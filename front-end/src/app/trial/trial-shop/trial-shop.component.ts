import { Component, OnInit, HostListener } from '@angular/core';

/**
 * Trial shop component primarily layout purposes,
 * combines app filter and app itemgrid in css grid.
 */
@Component({
  selector: 'app-trial-shop',
  templateUrl: './trial-shop.component.html',
  styleUrls: ['./trial-shop.component.scss']
})
export class TrialShopComponent {
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  innerWidth: any = window.innerWidth;
  isFirefox: boolean;

  /**Databinding for fixed nav directive on filter component. */
  fixed($event) {
    this.nav = $event;
  }
  /**Data for determining fixed status and width of filter component. */
  nav = { fixed: false, width: '0px' };

  constructor() {
    this.isFirefox = navigator.userAgent.indexOf('Firefox') > -1 ? true : false;
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

}
