import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
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
  styleUrls: ['./travel-duration.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TravelDurationComponent extends WizardSection implements OnInit {
  //#region decorators
  @Input() public formGroup: FormGroup;
  //#endregion

  //#region fields
  private _todayDate: Date = new Date();
  private _dateFormGroup: FormGroup;
  //#endregion

  //#region getters
  public get calendarDateFormat(): string {
    return AppConstants.CALENDAR.DATE_FORMAT;
  }

  public get todayDate(): Date {
    return this._todayDate;
  }

  public get minToDate(): Date {
    return this._dateFormGroup && this._dateFormGroup.get('from') && this._dateFormGroup.get('from').value ?
      this._dateFormGroup.get('from').value instanceof Date ?
        this._dateFormGroup.get('from').value :
        new Date(this._dateFormGroup.get('from').value)
      :
      this._todayDate;
  }

  public get dateFormGroup(): FormGroup {
    return this._dateFormGroup;
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
    return AppWizardConstants.SECTION_NAMES.TRAVEL_DURATION;
  }

  public order: number = 1;

  public get dataListName(): string {
    // return AppConstants.DATA_LIST_NAMES.DURATION;
    return null;
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
    debugger;
    super.initialize(input);
    const dateFormGroup = this.formGroup.get(this.userInfoPropertyName) as FormGroup;
    if (dateFormGroup) {
      const from = dateFormGroup.get('from');
      if (from && from.value) {
        from.setValue(new Date(from.value));
      }
      const to = dateFormGroup.get('to');
      if (to && to.value) {
        to.setValue(new Date(to.value));
      }
      this._dateFormGroup = dateFormGroup;
    }
    this._dateFormGroup.updateValueAndValidity();
  }

  public getValue() {
  }
  public setName() {
  }

  public validator: ValidatorFn = (control: FormControl) => {
    return control.value ? null : { error: 'Answer Required' };
  }

  public initializeFormControls() {
    debugger;
    const dateFormGroup = this.fb.group({
      from: [null, [this.validator]],
      to: [null, [this.validator]]
    });
    this.formGroup.addControl(this.userInfoPropertyName, dateFormGroup);
    this._dateFormGroup = this.formGroup.get(this.userInfoPropertyName) as FormGroup;
  }

  public updateFormControls(savedFormGroup: any) {
    debugger;
    const dateFormValue = savedFormGroup[this.userInfoPropertyName];
    if (dateFormValue.from) {
      dateFormValue.from = new Date(dateFormValue.from);
    }
    if (dateFormValue.to) {
      dateFormValue.to = new Date(dateFormValue.to);
    }
    super.updateFormControls(savedFormGroup);
  }
  //#endregion

  //#region public methods
  public onValueChange() {
    this.selectAnswer(this._dateFormGroup.getRawValue());
  }
  //#endregion
}
