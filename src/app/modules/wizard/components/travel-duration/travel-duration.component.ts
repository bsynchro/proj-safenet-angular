import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UITranslateService } from '@bsynchro/services';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { Translations } from 'src/app/shared/services/translation.service';
import { AppWizardConstants } from '../../constants/wizard.constants';
import { WizardSection } from '../../models/wizard-section';

@Component({
  selector: 'app-travel-duration',
  templateUrl: './travel-duration.component.html',
  styleUrls: ['./travel-duration.component.scss']
})
export class TravelDurationComponent extends WizardSection implements OnInit {
  //#region decorators
  @Input() public formGroup: FormGroup;
  //#endregion

  //#region fields
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
    return AppWizardConstants.SECTION_NAMES.TRAVEL_DURATION;
  }

  public order: number = 1;

  public get dataListName(): string {
    return AppConstants.DATA_LIST_NAMES.DURATION;
  }

  public get userInfoPropertyName(): string {
    return AppWizardConstants.USER_INFO_PROPERTIES.TRIP_DURATION;
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
}
