import { EventEmitter } from '@angular/core';
import { HostListener } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Output } from '@angular/core';
import { Directive } from '@angular/core';

@Directive({
  selector: '[appSuggestedSearch]'
})
export class SuggestedSearchDirective {
  @Output() public clickOutside = new EventEmitter();
  constructor(private _elementRef: ElementRef) { 
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
      const isClickedInside = this._elementRef.nativeElement.contains(targetElement);
      if (!isClickedInside) {
          this.clickOutside.emit(null);
      }
  }
}
