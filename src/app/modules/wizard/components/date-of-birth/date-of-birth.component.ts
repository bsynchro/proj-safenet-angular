import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UITranslateService } from '@bsynchro/services';
import { DropdownDatePickerComponent } from 'src/app/shared/components/dropdown-date-picker/dropdown-date-picker.component';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { GlobalVariable } from 'src/app/shared/models/global-variable.model';
import { Translations } from 'src/app/shared/services/translation.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { AppWizardConstants } from '../../constants/wizard.constants';
import { WizardSection } from '../../models/wizard-section';

@Component({
  selector: 'app-date-of-birth',
  templateUrl: './date-of-birth.component.html',
  styleUrls: ['./date-of-birth.component.scss']
})
export class DateOfBirthComponent extends WizardSection implements OnInit, AfterViewInit {
  //#region decorators
  @Input() public formGroup: FormGroup;
  @ViewChild('dateOfBirth', { static: false }) dobPickerComponent: DropdownDatePickerComponent;
  @Output() onDatePickerReady: EventEmitter<number> = new EventEmitter();
  //#endregion

  //#region fields
  private _formGroupValidators: Array<ValidatorFn> = [];
  private _maxAge: GlobalVariable;
  //#endregion

  //#region getters
  public get formGroupValidators(): Array<ValidatorFn> {
    return this._formGroupValidators;
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
    this.loadGlobalVariables();
    this.setValidators();
  }
  //#endregion

  //#region lifecycle hooks
  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const dob = this.formGroup.get(this.userInfoPropertyName).value;
    if (dob) {
      this.dobPickerComponent.dobFormGroup.patchValue(dob);
      this.formGroup.get(this.userInfoPropertyName).updateValueAndValidity();
      // Emit event to trigger wizard validation so wizard would autotrigger next if form is valid after it has been patched
      this.onDatePickerReady.emit(this.order);
    }
  }
  //#endregion

  //#region overrides
  public get name() {
    return AppWizardConstants.SECTION_NAMES.DOB;
  }

  public order: number = 2;

  public get dataListName(): string {
    return null;
  }

  public get userInfoPropertyName(): string {
    return AppWizardConstants.USER_INFO_PROPERTIES.DOB;
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
    return control.value &&
      control.value.year &&
      control.value.month &&
      control.value.day &&
      this.dobPickerComponent &&
      this.dobPickerComponent.dobFormGroup &&
      this.dobPickerComponent.dobFormGroup.valid
      ?
      null
      :
      { error: 'Answer Required' };
  }
  //#endregion

  //#region public methods
  public onValueChange(event: any) {
    if (this.dobPickerComponent && this.dobPickerComponent.dobFormGroup) {
      // const age = this.getAge(event);
      this.selectAnswer(this.dobPickerComponent.dobFormGroup.getRawValue());
    }
  }
  //#endregion

  //#region private methods
  private loadGlobalVariables() {
    const routeResolversData = this.activatedRoute.snapshot.data;
    if (routeResolversData) {
      const globalVariables = routeResolversData.globalVariables as Array<GlobalVariable>;
      this._maxAge = globalVariables.find((g) => g.name == AppConstants.GLOBAL_VARIABLE_NAMES.MAX_TRAVELER_AGE)
    }
  }

  private setValidators() {
    this._formGroupValidators = [this.maxAgeValidator()];
  }

  private maxAgeValidator(): ValidatorFn {
    return (formGroup: FormGroup) => {
      const formValue = formGroup.getRawValue();
      if (formValue && formValue.year && formValue.month && formValue.day) {
        const age = this.getAge(formValue);
        if (age > this._maxAge.value) {
          return {
            "complexError": {
              "message": "errorMessages.ageGreaterThanMax",
              "params": {
                "maxAge": this._maxAge.value
              }
            }
          };
        }
      }
      return null;
    };
  }

  private getAge(formValue: any): number {
    const dob = new Date(formValue.year, formValue.month, formValue.day);
    return UtilsService.getAge(dob);
  }
  //#endregion
}
