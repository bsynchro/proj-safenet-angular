
import { Directive, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[appKeyboardAutoOpenMobileFix]'
})
export class KeyboardAutoOpenMobileFixDirective implements OnInit {

    //#region fields
    @Input('appKeyboardAutoOpenMobileFix') dropdown: any;
    //#endregion fields

    constructor() { }

    ngOnInit() {
        this.primeNgOverwrites();
    }

    //#region private methods
    private overwriteOnOverlayAnimationStart() {
        if (this.dropdown.el.nativeElement.localName == 'p-multiselect') {
            // Multi-Select
            this.dropdown.show = () => {
                let _this = this.dropdown;
                if (!this.dropdown.overlayVisible) {
                    this.dropdown.overlayVisible = true;
                }
                //#region removed from the initial function
                // if (this.dropdown.filter) {
                //     setTimeout(function () {
                //         if (_this.filterInputChild != undefined) {
                //             _this.filterInputChild.nativeElement.focus();
                //         }
                //     }, 200);
                // }
                //#endregion removed from the initial function
                this.dropdown.bindDocumentClickListener();
            };
            return;
        }
        if (this.dropdown.el.nativeElement.localName == 'p-dropdown') {
            // Dropdown
            this.dropdown.onCustomOverlayAnimationStart = this.dropdown.onOverlayAnimationStart;
            this.dropdown.onOverlayAnimationStart = (event) => {
                this.dropdown.onCustomOverlayAnimationStart(event);
                if (this.dropdown.filterViewChild && this.dropdown.filterViewChild.nativeElement) {
                    this.dropdown.filterViewChild.nativeElement.blur();
                }
            };
            return;
        }
    }

    private primeNgOverwrites() {
        if (this.dropdown) {
            this.overwriteOnOverlayAnimationStart();
        }
        else {
            setTimeout(() => {
                this.overwriteOnOverlayAnimationStart();
            });
        }
    }
    //#endregion private methods
}