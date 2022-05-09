import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService, UITranslateService } from '@bsynchro/services';
import { MenuItem } from 'primeng/components/common/menuitem';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { Translations } from 'src/app/shared/services/translation.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  //#region fields
  private _profileSettings: Array<MenuItem>;
  private _user: any;
  private _profileSettingsTranslationSubscription: Subscription = new Subscription();
  //#endregion

  //#region getters
  public get isMobile(): boolean {
    return UtilsService.isMobile;
  }

  public get isLoggedIn(): boolean {
    return this._authService.isLoggedIn();
  }

  public get profileSettings(): Array<MenuItem> {
    return this._profileSettings;
  }

  public get user(): any {
    return this._user;
  }
  //#endregion

  //#region setters
  public set profileSettings(v: Array<MenuItem>) {
    this._profileSettings = v;
  }
  //#endregion

  //#region ctor
  constructor(
    private _authService: AuthenticationService,
    private _userService: UserService,
    private _translateService: UITranslateService,
    public translations: Translations
  ) { }
  //#endregion

  //#region lifecycle hooks
  ngOnInit() {
    this.setUser();
    this.initializeMenuItems();
  }
  //#endregion

  //#region public methods
  public login() {
    this._authService.startAuthentication();
  }

  public logOut = () => {
    this._authService.endAuthentication();
  }
  //#endregion

  //#region private methods
  private setUser() {
    this._userService.loggedInUser.subscribe((user) => this._user = user);
  }

  private initializeMenuItems() {
    this._profileSettings = [
      { id: '1', label: 'header.userMenu.changePassword', icon: 'fa lock-icon', routerLink: [AppConstants.ROUTES.USER, AppConstants.ROUTES.CHANGE_PASSWORD] },
      { id: '2', label: 'header.userMenu.logOut', icon: 'fa sign-out-icon', command: this.logOut }
    ];
    this._profileSettingsTranslationSubscription.unsubscribe();
    this._profileSettingsTranslationSubscription = this._translateService.bindTranslationsToArray(this._profileSettings, 'label', 'id');
  }
  //#endregion
}
