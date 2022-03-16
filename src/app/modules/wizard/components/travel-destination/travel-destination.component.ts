import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UITranslateService } from '@bsynchro/services';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { Translations } from 'src/app/shared/services/translation.service';
import { AppWizardConstants } from '../../constants/wizard.constants';
import { WizardSection } from '../../models/wizard-section';

@Component({
  selector: 'app-travel-destination',
  templateUrl: './travel-destination.component.html',
  styleUrls: ['./travel-destination.component.scss']
})
export class TravelDestinationComponent extends WizardSection implements OnInit {
  //#region decorators
  @Input() public formGroup: FormGroup;
  //#endregion

  //#region fields

  //#endregion

  //#region getters

  //#endregion

  //#region ctor
  constructor(
    public activatedRoute: ActivatedRoute,
    public translateService: UITranslateService,
    public fb: FormBuilder,
    public translations: Translations
  ) {
    super(activatedRoute, translateService, fb);
  }
  //#endregion

  //#region lifecycle hooks
  ngOnInit() {
  }
  //#endregion

  //#region overrides
  public get name() {
    return AppWizardConstants.SECTION_NAMES.TRAVEL_DESTINATION;
  }

  public order: number = 0;

  public get dataListName(): string {
    return AppConstants.DATA_LIST_NAMES.GEOGRAPHICAL_COVERAGE;
  }

  public get userInfoPropertyName(): string {
    return AppWizardConstants.USER_INFO_PROPERTIES.COVERAGE_AREA;
  }

  public get autoTriggerNext(): boolean {
    return !this.alreadyTriggered;
  }

  public checkVisibility = (): boolean => {
    return true;
  }

  public initialize(input: any): void {
    super.initialize(input);
  }

  public getValue() {
  }

  public setName() {
  }

  public validator: ValidatorFn = (control: FormControl) => {
    return control.value ? null : { error: 'Answer Required' };
  }
  //#endregion

  //#region public methods

  //#endregion
}
