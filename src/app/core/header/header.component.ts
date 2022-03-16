import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@bsynchro/services';
import { Translations } from 'src/app/shared/services/translation.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  //#region getters
  public get isMobile(): boolean {
    return UtilsService.isMobile;
  }

  public get isLoggedIn(): boolean {
    return this._authService.isLoggedIn();
  }
  //#endregion

  //#region ctor
  constructor(
    private _authService: AuthenticationService,
    public translations: Translations
  ) { }
  //#endregion

  //#region lifecycle hooks
  ngOnInit() {
  }
  //#endregion

  //#region public methods
  public login() {
    this._authService.startAuthentication();
  }
  //#endregion
}
