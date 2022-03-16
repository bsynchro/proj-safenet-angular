import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[auto-open-default]'
})
export class AutoOpenDefaultDirective implements OnInit {

    //#region decorators
    @Input('auto-open-default') autoOpenDefault: string;
    //#endregion decorators

    //#region fields
    private _elementRef: any;
    //#endregion fields

    //#region ctor
    constructor(private _ngControl: NgControl, private elementRef: ElementRef) {
        this._elementRef = this.elementRef.nativeElement;
    }
    //#endregion ctor

    //#region hooks
    ngOnInit() {
        this.openDropdown();
    }
    //#region hooks

    //#region private methods
    private openDropdown() {
        setTimeout(() => {
            if (this.autoOpenDefault !== 'false' && !this._ngControl.value) {
                this._elementRef.firstChild.click();
            }
        });
    }
    //#endregion private methods
}