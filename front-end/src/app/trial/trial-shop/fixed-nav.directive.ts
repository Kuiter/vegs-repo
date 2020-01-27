import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

/**
 * Fixed nav directive changes element display options for app filter 
 * positioned in trial-shop.component.html. If subjects scrolls further down 
 * then 128px app filter converted to position fixed.
 * BUG: does not properly work on Chrome.
 */
@Directive({
  selector: '[appFixedNav]'
})
export class FixedNavDirective {
  /**Hostlistener for window scroll event. */
  @HostListener('window:scroll', ['$event'])
  /**
   * Switch based on scroll event.
   */
  doSomething(event) {
    if (window.pageYOffset > 128) {
      if (!this.width || (this.width == 0 && this.el.nativeElement.offsetWidth != 0)) {
        this.width = this.el.nativeElement.offsetWidth;
      }
      if (!this.f) {
        this.el.nativeElement.style.position = 'fixed';
        this.el.nativeElement.style.top = '0px';
        this.el.nativeElement.style.width = `${this.width}px`
        this.fixed.emit({ fixed: true, width: `${this.width}px` });
        this.f = true
      }

    }
    if (window.pageYOffset <= 128) {
      if (this.f) {
        this.el.nativeElement.style.position = 'inherit';
        this.fixed.emit({ fixed: false, width: '0px' });
        this.f = false
      }
    }
  }
  /**
   * Databinding emits fixed event fro placement of div to prevent nav resize.
   * @emits Object {fixed: Boolean, width: String}
   */
  @Output() fixed: EventEmitter<any> = new EventEmitter();
  el: ElementRef;
  width;
  f = false;

  constructor(el: ElementRef) {
    this.el = el;
  }

}
