import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventPayload, Step, UITranslateService, WizardComponent } from '@bsynchro/services';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AppWizardConstants } from '../../constants/wizard.constants';

@Component({
  selector: 'app-wizard-container',
  templateUrl: './wizard-container.component.html',
  styleUrls: ['./wizard-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WizardContainerComponent implements OnInit {
  //#region decorators
  @ViewChild('wizard', { static: false }) wizard: WizardComponent;
  //#endregion

  //#region fields
  private _sections: Array<any> = [
    {
      name: AppWizardConstants.SECTION_NAMES.TRAVEL_DESTINATION,
      order: 0
    },
    {
      name: AppWizardConstants.SECTION_NAMES.TRAVEL_DURATION,
      order: 1
    },
    {
      name: AppWizardConstants.SECTION_NAMES.DOB,
      order: 2
    },
    {
      name: AppWizardConstants.SECTION_NAMES.TRAVEL_TYPE,
      order: 3
    },
  ];
  private _editMode: boolean = false;
  private _initialStep: number = 0;
  private _formGroup: FormGroup;
  //#endregion

  //#region getters
  public get sections(): Array<Step> {
    return this._sections;
  }

  public get editMode(): boolean {
    return this._editMode;
  }

  public get initialStep(): number {
    return this._initialStep;
  }

  public get formGroup(): FormGroup {
    return this._formGroup;
  }

  public get isValid(): boolean {
    return this.wizard && this.wizard.stepsArray.every(s => s.isValid());
  }
  //#endregion

  //#region ctor
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _translateService: UITranslateService
  ) {
    this._formGroup = this._fb.group({});
    this.setEditMode();
    this.setRefferalParams();
  }
  //#endregion

  //#region lifecycle hooks
  ngOnInit() {
  }

  //#endregion

  //#region public methods
  public triggerWizardValidation(selectedIndex: number) {
    this.wizard.isValid(selectedIndex);
  }

  public async nextEventHandler(event: EventPayload) {
    if (this.isLastStep() && this.wizard.isValid()) {
      this.navigateToGetOffers();
      // Manually set alreadyTriggered to true to avoid emitNext loop
      this.wizard.stepsArray[this.wizard.selectedIndex].alreadyTriggered = true;
    }
  }
  //#endregion

  //#region private methods
  private isLastStep(): boolean {
    return this.wizard &&
      this.wizard.selectedIndex &&
      this.wizard.stepsArray &&
      this.wizard.stepsArray.length &&
      this.wizard.selectedIndex &&
      this.wizard.selectedIndex == this.wizard.stepsArray.length - 1;
  }

  private navigateToGetOffers() {
    this._router.navigate([AppConstants.ROUTES.MAIN, AppConstants.ROUTES.OFFERS]);
  }

  private setEditMode() {
    const activatedRouteSnapshot = this._activatedRoute.snapshot;
    if (activatedRouteSnapshot && activatedRouteSnapshot.params && activatedRouteSnapshot.params[AppConstants.ROUTE_DATA_KEYS.EDIT_MODE]) {
      this._editMode = activatedRouteSnapshot.params[AppConstants.ROUTE_DATA_KEYS.EDIT_MODE];
    }
  }

  private setRefferalParams() {
    const activatedRouteSnapshot = this._activatedRoute.snapshot;
    if (activatedRouteSnapshot && activatedRouteSnapshot.queryParams) {
      const refferal = activatedRouteSnapshot.queryParams[AppConstants.ROUTE_DATA_KEYS.REF];
      if (refferal) {
        LocalStorageService.setInLocalStorage(AppConstants.LOCAL_STORAGE.REFFERER, refferal);
        const countryOfArrivalIsoCode = activatedRouteSnapshot.queryParams[AppConstants.ROUTE_DATA_KEYS.CA];
        const countryOfArrival = this.getCountryCodeByIsoCode(countryOfArrivalIsoCode);
        LocalStorageService.setInLocalStorage(AppConstants.LOCAL_STORAGE.COUNTRY_OF_ARRIVAL, countryOfArrival);
        const countryOfDepartureIsoCode = activatedRouteSnapshot.queryParams[AppConstants.ROUTE_DATA_KEYS.CD];
        const countryOfDeparture = this.getCountryCodeByIsoCode(countryOfDepartureIsoCode);
        LocalStorageService.setInLocalStorage(AppConstants.LOCAL_STORAGE.COUNTRY_OF_DEPARTURE, countryOfDeparture);
      }
    }
  }

  private getCountryCodeByIsoCode(countryIsoCode: any) {
    const routeResolversData = this._activatedRoute.snapshot.data;
    const dataLists = this._translateService.getLocalizedDataLists(routeResolversData.dataLists);
    const countryDataList = dataLists.find((d) => d[0].dataListName === AppConstants.DATA_LIST_NAMES.COUNTRY);
    const row = countryDataList.find(d => d.isoCode.toUpperCase() == countryIsoCode.toUpperCase());
    const countryCode = row.code;
    return countryCode;
  }
  //#endregion
}
