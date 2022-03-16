import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UITranslateService } from '@bsynchro/services';
import { Translations } from 'src/app/shared/services/translation.service';
import { AppWizardConstants } from '../../constants/wizard.constants';
import { WizardSection } from '../../models/wizard-section';

@Component({
  selector: 'app-travel-type',
  templateUrl: './travel-type.component.html',
  styleUrls: ['./travel-type.component.scss']
})
export class TravelTypeComponent extends WizardSection implements OnInit {
  //#region decorators
  @Input() public formGroup: FormGroup;
  //#endregion

  //#region fields
  private _choices: Array<{ code: string, key: string }> = [
    {
      code: AppWizardConstants.TRAVEL_TYPES.CODES.INDIVIDUAL,
      key: AppWizardConstants.TRAVEL_TYPES.TRANSLATION_KEYS.INDIVIDUAL
    },
    {
      code: AppWizardConstants.TRAVEL_TYPES.CODES.FAMILY,
      key: AppWizardConstants.TRAVEL_TYPES.TRANSLATION_KEYS.FAMILY
    }
  ];
  //#endregion

  //#region getters
  public get choices(): Array<{ code: string, key: string }> {
    return this._choices;
  }
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
    return AppWizardConstants.SECTION_NAMES.TRAVEL_TYPE;
  }

  public order: number = 3;

  public get dataListName(): string {
    return null;
  }

  public get userInfoPropertyName(): string {
    return AppWizardConstants.USER_INFO_PROPERTIES.TYPE;
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
