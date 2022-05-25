import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UITranslateService } from '@bsynchro/services';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  //#region properties
  public get direction(): string {
    return this._translationService.direction;
  }
  //#endregion

  //#region ctor
  constructor(
    private _translationService: UITranslateService,
    private _loaderService: LoaderService
  ) { }
  //#endregion

  //#region lifecycle hooks
  ngOnInit() {
  }
  //#endregion
}
