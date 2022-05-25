import { Directive, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { EventPayload } from '@bsynchro/services';
import { Subscription } from 'rxjs/internal/Subscription';
import { BroadcastService } from '../services/broadcast.service';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[auto-open-publisher]'
})
export class AutoOpenPublisherDirective implements OnInit, OnDestroy {

    //#region decorators
    @Input() name: string;
    @Input() autoOpenOnblur: string;
    @Input('auto-open-publisher') autoOpenPublisher: boolean;
    //#endregion decorators

    //#region HostListener declaration
    @HostListener("focusout", ["$event.target.value"])
    public onFocusOut(event: any): void { };
    //#endregion HostListener declaration

    //#region fields
    private _prevValue: any;

    private valueChangeSubscription: Subscription;
    //#endregion fields

    //#region ctor
    constructor(private _ngControl: NgControl, private _broadcastService: BroadcastService) {
    }
    //#endregion ctor

    //#region hooks
    ngOnInit() {
        if (this.autoOpenOnblur === 'true') {
            this.registerFocusOut();
        } else {
            this.subscribeValueChange();
        }
    }

    ngOnDestroy() {
        this.unregisterFocusOut();
        this.unSubscribeValueChange();
    }
    //#region hooks

    //#region Register/UnRegister Handlers
    private registerFocusOut() {
        this.onFocusOut = this.onFocusOutHandler;
    }

    private unregisterFocusOut() {
        this.onFocusOut = () => { };
    }

    private subscribeValueChange() {
        this.valueChangeSubscription = this._ngControl.valueChanges.subscribe(change => {
            if (this._prevValue != change) {
                this._prevValue = change;
                if (change) {
                    this._broadcastService.broadcast(new EventPayload(this.name, change));
                }
            }
        });
    }

    private unSubscribeValueChange() {
        if (this.valueChangeSubscription) {
            this.valueChangeSubscription.unsubscribe();
        }
    }
    //#endregion Register/UnRegister Handlers

    //#region handlers
    private onFocusOutHandler(event: any): void {
        if (this._ngControl.value) {
            this._broadcastService.broadcast(new EventPayload(this.name, this._ngControl.value));
        }
    }
    //#endregion handlers
}