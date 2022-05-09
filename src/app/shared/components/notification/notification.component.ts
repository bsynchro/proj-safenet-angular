import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UITranslateService } from '@bsynchro/services';
import { AppConstants } from '../../constants/app.constants';
import { INotificationMessage } from '../../models/INotificationMessage';
import { ActionMessage, NotificationStatus, SectionMessage, SectionMessageType } from '../../models/section-message';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  //#region fields
  @ViewChild("sectionError", { static: true }) sectionErrorTemplate: TemplateRef<any>;
  @ViewChild("sectionAction", { static: true }) sectionActionTemplate: TemplateRef<any>;
  private _templateMap: { [key: number]: TemplateRef<any> } = {};
  //#endregion

  //#region ctor
  constructor(
    private _notificationService: NotificationService,
    private _router: Router,
    private _translateService: UITranslateService
  ) { }
  //#endregion

  //#region getters
  public get isVisible(): boolean {
    return this._notificationService.isVisible;
  }
  public get messages(): Array<INotificationMessage> {
    return this._notificationService.messages;
  }
  //#endregion

  //#region lifecycle hooks
  ngOnInit() {
    this.initializeTemplateMap();
    this.handleEmptyNotifications();
  }
  //#endregion

  //#region public methods
  public isSection(msg: INotificationMessage): boolean {
    return msg instanceof SectionMessage;
  }

  public getMessageTitle(msg: INotificationMessage): string {
    return (msg as SectionMessage).titleTranslationKey;
  }

  public getMessageText(msg: INotificationMessage): string {
    return (msg as SectionMessage).textTranslationKey;
  }

  public getIconString(msg: INotificationMessage): string {
    switch ((msg as SectionMessage).status) {
      case NotificationStatus.error:
        return "fa fa-exclamation-circle";
      case NotificationStatus.info:
        return "fa fa-exclamation-circle";
      case NotificationStatus.warning:
        return "fa fa-exclamation-circle";
      case NotificationStatus.success:
        return "fa fa-check-circle";
      default:
        return "fa fa-exclamation-circle";
    }
  }

  public getTemplate(msg: INotificationMessage) {
    if (msg instanceof SectionMessage) {
      return this._templateMap[(msg as SectionMessage).type];
    }
  }
  //#region events
  public onDismiss(msg: INotificationMessage) {
    this._notificationService.dismissMessage(msg);
  }

  public onMessageActionClick(msg: ActionMessage) {
    msg.action();
  }
  //#endregion
  //#endregion

  //#region private methods
  private initializeTemplateMap() {
    this._templateMap[SectionMessageType.error] = this.sectionErrorTemplate;
    this._templateMap[SectionMessageType.action] = this.sectionActionTemplate;
  }

  private handleEmptyNotifications() {
    if (!this._notificationService.messages || !this._notificationService.messages.length) {
      this._router.navigate([AppConstants.ROUTES.MAIN], { replaceUrl: true });
    }
  }
  //#endregion
}
