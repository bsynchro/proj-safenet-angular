import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { EventPayload } from '@bsynchro/services';
import { Subscription } from 'rxjs/internal/Subscription';
import { BroadcastService } from '../services/broadcast.service';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[auto-open-subscribe-to]'
})
export class AutoOpenSubscribeToDirective implements OnInit, OnDestroy {

    //#region decorators
    @Input() name: string;
    @Input() autoOpenOnce: string;
    @Input('auto-open-subscribe-to') autoOpenSubscribeTo: string;
    //#endregion decorators

    //#region fields
    private _elementRef: any;
    private _eventSubscription: Subscription;
    //#endregion fields

    //#region ctor
    constructor(private _ngControl: NgControl, private elementRef: ElementRef, private _broadcastService: BroadcastService) {
        this._elementRef = this.elementRef.nativeElement;
    }
    //#endregion ctor

    //#region hooks
    ngOnInit() {
        this.subscribeToEvent();
    }

    ngOnDestroy() {
        if (this._eventSubscription) {
            this._eventSubscription.unsubscribe();
        }
    }
    //#region hooks

    //#region private methods
    private openDropdown() {
        setTimeout(() => {
            this._elementRef.firstChild.click();
        });
    }

    private subscribeToEvent() {
        if (this.autoOpenSubscribeTo) {
            this._eventSubscription = this._broadcastService.on(this.autoOpenSubscribeTo).subscribe((res) => {
                if (this._ngControl.value) {
                    this._broadcastService.broadcast(new EventPayload(this.name, this._ngControl.value));
                } else {
                    this.openDropdown();
                }
                if (this.autoOpenOnce !== 'false') {
                    this._eventSubscription.unsubscribe();
                }
            });
        }
    }
    //#endregion private methods
}