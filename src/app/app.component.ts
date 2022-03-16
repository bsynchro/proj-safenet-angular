import { Component } from '@angular/core';
import { AuthenticationService } from '@bsynchro/services';
import { LoaderService } from './shared/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'proj-safenet-angular';
  //#region ctor
  constructor(
    private _authService: AuthenticationService,
    private _loaderService: LoaderService
  ) {
    // this._authService.getUserFromLocalStorage().subscribe((user) => {
    //   console.log(user);
    // });
  }
  //#endregion
  public get loaderVisible(): boolean {
    return this._loaderService.isLoaderVisible;
  }
}
