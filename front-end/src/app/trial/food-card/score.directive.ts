import { Directive, ElementRef, Input } from '@angular/core';

/**
 * Directive for score display purposes. (On food-card, and food details)
 */
@Directive({
  selector: '[appScore]'
})
export class ScoreDirective {
  /**Databinding to recieve score from parent */
  @Input('score') set score(score) {
    this.el.nativeElement.style.width = score;
  }

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.height = '24px';
    this.el.nativeElement.style.backgroundColor = '#f1f1f1';
    this.el.nativeElement.style.marginLeft = '-1px';
  }

}
