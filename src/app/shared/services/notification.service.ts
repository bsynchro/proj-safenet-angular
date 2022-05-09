import { Injectable } from "@angular/core";
import { INotificationMessage } from "../models/INotificationMessage";
import { SectionMessage } from "../models/section-message";

@Injectable({
    providedIn: "root",
})
export class NotificationService {
    //#region fields
    private _messages: Array<INotificationMessage> = [];
    private _isVisible: boolean = false;
    //#endregion

    //#region getters
    public get messages(): Array<INotificationMessage> {
        return this._messages;
    }
    public get isVisible(): boolean {
        return this._isVisible;
    }
    //#endregion

    //#region setters
    public set isVisible(v: boolean) {
        this._isVisible = v;
    }
    //#endregion

    //#region ctor
    constructor() {
        // const x = new DialogMessage();
        // x.title = "test title";
        // x.messageText = "test msg text";
        // x.type = DialogType.navigation;
        // x.status = NotificationStatus.success;
        // this.showNotification(x);
    }
    //#endregion

    //#region public methods
    public showNotification(msg: INotificationMessage) {
        this._messages.push(msg);
        this._isVisible = true;
        switch (typeof msg) {
            case typeof SectionMessage: {
                return;
            }
            // case typeof ToastMessage: {
            //     this.showToastMessage(msg as ToastMessage)
            //     return;
            // }
            default:
                return;
        }
    }

    public dismissMessage(msg: INotificationMessage) {
        this._messages = this._messages.filter((m) => m !== msg);
        this._isVisible = !!this._messages.length;
    }

    public clearMessages() {
        this._messages = [];
        this._isVisible = false;
    }
    //#endregion
}
