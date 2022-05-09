import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, DialogService, UITranslateService } from '@bsynchro/services';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { ActionMessage, NotificationStatus } from 'src/app/shared/models/section-message';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Translations } from 'src/app/shared/services/translation.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  //#region fields
  private _form: FormGroup;
  private _passwordRegExp: RegExp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  private _submitClicked: boolean;
  private _showInvalidPasswordMessage: boolean;
  //#endregion

  //#region getters
  public get form(): FormGroup {
    return this._form;
  }

  public get submitClicked(): boolean {
    return this._submitClicked;
  }

  public get showInvalidPasswordMessage(): boolean {
    return this._showInvalidPasswordMessage;
  }
  //#endregion

  //#region setters
  public set form(v: FormGroup) {
    this._form = v;
  }
  //#endregion

  //#region ctor
  constructor(
    private _fb: FormBuilder,
    private _userService: UserService,
    private _router: Router,
    private _location: Location,
    private _authService: AuthenticationService,
    private _notificationService: NotificationService,
    private _dialogService: DialogService,
    private _translateService: UITranslateService,
    public translations: Translations
  ) { }
  //#endregion

  //#region lifecycle hooks
  ngOnInit() {
    this.initForm();
  }
  //#endregion

  //#region public methods
  public onOldPasswordChange(event: any) {
    this._showInvalidPasswordMessage = false;
  }

  public submit() {
    this._submitClicked = true;
    if (this._form.valid) {
      this._userService.changePassword(
        this._form.get('oldPassword').value,
        this._form.get('newPassword').value,
        this._form.get('confirmPassword').value)
        .subscribe((response) => {
          if (response) {
            this._showInvalidPasswordMessage = false;
            const message = new ActionMessage();
            message.status = NotificationStatus.success;
            message.textTranslationKey = this.translations.user.changePassword.notification.text;
            message.titleTranslationKey = this.translations.user.changePassword.notification.title;
            message.actionTranslationKey = this.translations.user.changePassword.notification.action;
            message.buttonClass = 'link';
            message.action = () => {
              LocalStorageService.setInLocalStorage(AppConstants.LOCAL_STORAGE.SHOULD_LOGIN, true);
              this._authService.endAuthentication();
              ;
            }
            this._notificationService.clearMessages();
            this._notificationService.showNotification(message);
            this._router.navigate([AppConstants.ROUTES.MAIN, AppConstants.ROUTES.NOTIFICATION]);
          }
          else {
            this._showInvalidPasswordMessage = true;
          }
        });
    }
  }

  public close() {
    const dialogMessage = this._translateService.getInstantTranslation(this.translations.user.changePassword.notification.dialog.message);
    const acceptLabel = this._translateService.getInstantTranslation(this.translations.user.changePassword.notification.dialog.acceptLabel);
    const rejectLabel = this._translateService.getInstantTranslation(this.translations.user.changePassword.notification.dialog.rejectLabel);
    this._dialogService.showConfirmationDialog(dialogMessage, acceptLabel, rejectLabel).subscribe((accepted) => {
      if (accepted) {
        this._location.back();
      }
    });
  }
  //#endregion

  //#region private methods
  private initForm() {
    this._form = this._fb.group({
      oldPassword: [null, [Validators.required, Validators.minLength(8)]],
      newPassword: [null, [Validators.required, Validators.pattern(this._passwordRegExp)]],
      confirmPassword: [null, [Validators.required, Validators.pattern(this._passwordRegExp)]]
    });
    this._form.setValidators(this.matchingPasswordsValidator);
  }

  private matchingPasswordsValidator: ValidatorFn = (group: FormGroup) => {
    if (group.get('newPassword').value && group.get('confirmPassword').value) {
      return group.get('newPassword').value == group.get('confirmPassword').value ? null : { passwordsDoNotMatch: true };
    }
  }
  //#endregion
}
