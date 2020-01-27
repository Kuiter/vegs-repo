import { Directive, ElementRef, Input } from '@angular/core';

/**
 * For alternating the background color based on index value given
 */
@Directive({
  selector: '[appAlternateBgColor]'
})
export class AlternateBgColorDirective {

  @Input('index') set ind(index) {
    this.setBgColor(index);
  };

  constructor(
    private el: ElementRef
  ) {}

  setBgColor(val) {
    (val + 1) % 2 == 0 ? this.el.nativeElement.style.backgroundColor = 'rgba(0,0,0,.1)' : this.el.nativeElement.style.backgroundColor = 'white'
  }

}
