import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthenticationService } from '@bsynchro/services';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppConstants } from './shared/constants/app.constants';
import { LoaderService } from './shared/services/loader.service';
import { LocalStorageService } from './shared/services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  //#region fields
  title = 'proj-safenet-angular';
  private _routeSubscription: Subscription = new Subscription();
  //#endregion
  //#region ctor
  constructor(
    private _authService: AuthenticationService,
    private _loaderService: LoaderService,
    private _router: Router
  ) {
    // this._authService.getUserFromLocalStorage().subscribe((user) => {
    //   console.log(user);
    // });
  }
  //#endregion

  //#region getters
  public get loaderVisible(): boolean {
    return this._loaderService.isLoaderVisible;
  }
  //#endregion

  //#region private methods
  //#endregion
}
