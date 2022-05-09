import { INotificationMessage } from "./INotificationMessage";

export class SectionMessage implements INotificationMessage {
    public textTranslationKey: string;
    public titleTranslationKey: string;
    public status: NotificationStatus;
    public type: SectionMessageType;
}

export class ActionMessage extends SectionMessage {
    constructor() {
        super();
        this.type = SectionMessageType.action;
    }
    public action: () => any;
    public buttonClass: string;
    public actionTranslationKey: string;
}

export enum NotificationStatus {
    error = 1,
    info = 2,
    success = 3,
    warning = 4
}

export enum SectionMessageType {
    error = 1,
    action = 2
}