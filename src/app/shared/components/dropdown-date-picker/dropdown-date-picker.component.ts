import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { Utils } from '@bsynchro/services';
import { Dropdown } from 'primeng/dropdown';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { Translations } from '../../services/translation.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-dropdown-date-picker',
  templateUrl: './dropdown-date-picker.component.html',
  styleUrls: ['./dropdown-date-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownDatePickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DropdownDatePickerComponent),
      multi: true,
    },
  ]
})
export class DropdownDatePickerComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {

  //#region decorators
  @Input() public responseMapper = this.mapToDate;
  @Input() public name: string;
  @Input() public productId: number;
  @Input() public oldestYear: number;
  @Input() public youngestYear: number;
  @Input() public format: string;
  @Input() public watermarks: { Day: string, Month: string, Year: string };
  @Input() public labels: { Day: string, Month: string, Year: string };
  @Input() public required: boolean;
  @Input() public noAsterisk: boolean;
  @Input() public default: { Day: any, Month: any, Year: any };
  @Input() public hideHints: boolean;
  @Input() public dataValue: any;
  @Input() public monthDataList: Array<any>;
  @Input() public autoOpen: boolean;
  @Input() public showFilter: boolean;
  @Input() public formGroupValidators: Array<ValidatorFn>
  @Output() changeHandler: EventEmitter<any>;
  @ViewChild('yearDropdown', { static: false }) yearDropdown: Dropdown;

  //#endregion decorators

  //#region fields
  private _dobFormGroup: FormGroup;

  private _yearOptions: Array<any>;
  private _monthOptions: Array<any>;
  private _dayOptions: Array<any>;

  private _currentDate = new Date();
  private _monthTitles = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  public showHints: boolean;
  public isDisabled: boolean = false;
  private subscriptions: Subscription;
  //#endregion fields

  //#region ctor

  constructor(
    private _fb: FormBuilder,
    public translations: Translations) {
    this.initializeFormGroup();
    this.changeHandler = new EventEmitter<any>();
  }
  //#endregion ctor

  //#region hooks
  ngOnInit() {
    this.initialize();
    this.addListeners(); // To trigger onChangeCallback which will trigger the validate
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hideHints'] && !isNullOrUndefined(changes['hideHints'].currentValue)) {
      this.showHints = !this.showHints;
    }
    if (changes['dataValue'] && !isNullOrUndefined(changes['dataValue'].currentValue)) {
      this.initValue();
    }
    if (changes['monthDataList'] && !isNullOrUndefined(changes['monthDataList'].currentValue)) {
      this._monthTitles = this.monthDataList.map(m => m.label ? m.label : (m.name ? m.name : m.row.name));
      this.refreshMonth();
    }
  }
  //#endregion hooks

  //#region properties
  public get elementId() {
    return this.name ? this.name : 'dropdown-date-picker';
  }

  public get isVisible() {
    let dropdown = document.querySelector(`#${this.elementId}`);
    if (dropdown && dropdown['offsetParent']) { // offsetParent == null > element or parent element is hidden
      return true;
    }
    return false;
  }

  public get dobFormGroup(): FormGroup {
    return this._dobFormGroup;
  }

  public get yearOptions(): Array<any> {
    return this._yearOptions;
  }

  public get monthOptions(): Array<any> {
    return this._monthOptions;
  }

  public get dayOptions(): Array<any> {
    return this._dayOptions;
  }

  public get year() {
    return this.dobFormGroup.get('year').value;
  }

  public set year(value) {
    this.dobFormGroup.get('year').patchValue(value);
  }

  public get month() {
    return this.dobFormGroup.get('month').value;
  }

  public set month(value) {
    this.dobFormGroup.get('month').patchValue(value);
  }

  public get day() {
    return this.dobFormGroup.get('day').value;
  }

  public set day(value) {
    this.dobFormGroup.get('day').patchValue(value);
  }

  public get monthDisability() {
    if (this.isDisabled) return true;
    return !(this.year ? true : false);
  }

  public get dayDisability() {
    if (this.isDisabled) return true;
    return !(this.year && this.month ? true : false);
  }

  public get errorMessages() {
    if (!this._dobFormGroup || !this._dobFormGroup.controls) { return ''; }
    // let requiredMessage = this._dobFormGroup.controls.some(c =>);
    if (this._dobFormGroup.touched) {
      let requiredMessage = Object.keys(this.dobFormGroup.controls).some(a => this.dobFormGroup.controls[a].errors && this.dobFormGroup.controls[a].errors.required);
      if (requiredMessage) {
        return 'errorMessages.fieldIsRequired';
      }
      let invalidDob = Object.keys(this.dobFormGroup.controls).some(a => this.dobFormGroup.controls[a].errors && this.dobFormGroup.controls[a].errors.invalidDob);
      if (invalidDob) {
        return 'errorMessages.invalidDob';
      }
      let incompleteDob = Object.keys(this.dobFormGroup.controls).some(a => this.dobFormGroup.controls[a].errors && this.dobFormGroup.controls[a].errors.incompleteDob);
      if (incompleteDob) {
        return 'errorMessages.incompleteDob';
      }
    }
    return '';
  }

  public get complexError(): any {
    if (this._dobFormGroup && this._dobFormGroup.controls && this._dobFormGroup.touched && !this._dobFormGroup.valid) {
      if (this.dobFormGroup.errors && this.dobFormGroup.errors.complexError) {
        return this.dobFormGroup.errors.complexError;
      }
    }
    return '';
  }

  public get asterisk(): string {
    return this.required && !this.noAsterisk ? ' *' : '';
  }
  //#endregion properties

  //#region implementation
  public validate(control: AbstractControl): ValidationErrors {
    try {
      this.onFieldChange();
      let formErrors: any = {};
      let controls = this.dobFormGroup.controls;
      for (let key in controls) {
        if (controls.hasOwnProperty(key)) {
          const value = controls[key];
          const controlValidator = value.validator({} as AbstractControl);
          if (value.status == 'INVALID' || (controlValidator && controlValidator.required && Utils.isEmpty(value.value))) {
            formErrors = { ...formErrors, [key]: false }
          }
        }
      }
      return formErrors ? formErrors : null;
    } catch {
      return { form: false }
    }
  }
  public registerOnValidatorChange?(fn: () => void): void {
    // not supported
  }
  public writeValue(obj: any): void {
    this.dataValue = obj;
    this.initValue();
    // if (obj === null) {
    //   if (this.dobFormGroup) {
    //     this.dobFormGroup.reset()
    //   }
    // }
  }

  public onChangeCallback: any = () => { };
  public onTouchedCallback: any = () => { };

  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  public setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (isDisabled) {
      this._dobFormGroup.controls.year.disable();
      this._dobFormGroup.controls.month.disable();
      this._dobFormGroup.controls.day.disable();
    }
    else {
      this._dobFormGroup.controls.year.enable();
      this._dobFormGroup.controls.month.enable();
      this._dobFormGroup.controls.day.enable();
    }
  }
  //#endregion implementation

  //#region FormControl Validator
  private controlValidator = (date: FormControl): { [key: string]: string } => {
    // return { errorMessage: 'errorMessage' }
    return null;
  }
  //#endregion

  //#region helper
  private mapToDate(input: { year: any, month: any, day: any }) {
    if (input == null || (input.year == null && input.month == null && input.day == null)) return null;
    return new Date(input.year, input.month - 1, input.day);
  }

  private onFieldChange() {
    if (!!this.day && !!this.month && !!this.year && this.isValid(this.year, this.month, this.day)) {
      // Validity set after ngModel because form valid is being triggered as valid before mapping the value
      this.setNgModel(UtilsService.getFormattedDateInstance(this.getDate(), this.format));
      this._dobFormGroup.controls.year.setErrors(null);
      this._dobFormGroup.controls.month.setErrors(null);
      this._dobFormGroup.controls.day.setErrors(null);
    } else if (!!this.day || !!this.month || !!this.year && (this.day || this.month || this.year)) {
      this.setNgModel();
      this.dobFormGroup.controls.year.setErrors({ "incompleteDob": true });
      this.dobFormGroup.controls.month.setErrors({ "incompleteDob": true });
      this.dobFormGroup.controls.day.setErrors({ "incompleteDob": true });
    } else {
      this.setNgModel();
      this.dobFormGroup.controls.year.setErrors({ "invalidDob": true });
      this.dobFormGroup.controls.month.setErrors({ "invalidDob": true });
      this.dobFormGroup.controls.day.setErrors({ "invalidDob": true });
    }
    this.onChangeInternal();
  }

  private getNbOfDaysInMonth(year, month) {
    // To get max Day of month, Create new Date with next month of day 0.
    return new Date(year, month, 0).getDate();
  }

  private getDate() {
    return new Date(this.year, this.month - 1, this.day);
  }

  private getUiMonth(date) {
    return date.getMonth() + 1;
  }
  //#endregion helper

  //#region options initialization
  private setDayOptions(min: number, max: number) {
    if (!min) { min = 1; }
    if (!max) { max = 31; }
    this._dayOptions = [];
    for (let i = min; i <= max; i++) {
      this._dayOptions.push({ value: i, label: i.toString(), name: i.toString() });
    }
  }

  private setMonthOptions(min: number, max: number) {
    if (!min) { min = 1; }
    if (!max) { max = 12; }
    this._monthOptions = [];
    for (let i = min; i <= max; i++) {
      this._monthOptions.push({ value: i, label: this._monthTitles[i - 1], name: this._monthTitles[i - 1] });
    }
  }

  private setYearOptions(min: number, max: number) {
    if (!min) { min = 1900; }
    if (!max) { max = 2020; }
    this._yearOptions = [];
    for (let i = min; i <= max; i++) {
      this.yearOptions.push({ value: i, label: i.toString(), name: i.toString() });
    }
  }
  //#endregion options initialization

  //#region set models
  private setDayMonthYearModels(date) {
    if (!!date) {
      this.day = date.getDate();
      this.month = this.getUiMonth(date);
      this.year = date.getFullYear();
    }
  }

  private setNgModel(value?: any) {
    if (!value) { value = ""; }
    this.dataValue = value;
    this.onChangeInternal();
  }
  //#endregion set models

  //#region refresh DOB options
  private refreshDays() {
    let maxDay = 31;
    let minDay = 1;
    if (!!this.year && !!this.month && this.year == this._currentDate.getFullYear() && this.month == this.getUiMonth(this._currentDate)) {
      maxDay = this._currentDate.getDate();
      this.setDayOptions(minDay, maxDay);
    }
    else {
      if (!!this.month && !!this.year) {
        maxDay = this.getNbOfDaysInMonth(this.year, this.month);
        this.setDayOptions(minDay, maxDay);
      }
      else {
        this.setDayOptions(minDay, maxDay);
      }
    }
    if (this.day < minDay || this.day > maxDay) {
      this.day = null;
    }
  }

  private refreshMonth() {
    let maxMonth = 12;
    let minMonth = 1;
    if (!!this.year && this.year == this._currentDate.getFullYear() && this.youngestYear == 0) {
      maxMonth = this.getUiMonth(this._currentDate);
      this.setMonthOptions(minMonth, maxMonth);
    }
    else {
      this.setMonthOptions(minMonth, maxMonth);
    }
    if (this.month < minMonth || this.month > maxMonth) {
      this.month = null;
    }
  }

  private refreshYear() {
    let minYear = this._currentDate.getFullYear() - this.oldestYear;
    let maxYear = this._currentDate.getFullYear() - this.youngestYear;
    if (!!this.year && this.year < minYear) {
      minYear = this.year;
    } else if (!!this.year && this.year > maxYear) {
      maxYear = this.year;
    }
    this.setYearOptions(minYear, maxYear);

    if (this.year < minYear || this.year > maxYear) {
      this.year = null;
    }
  }
  //#endregion refresh DOB options

  //#region initialization
  private initializeFormGroup() {
    this._dobFormGroup = this._fb.group({
      year: [null, [this.controlValidator]], //Validators.required
      month: [null, [this.controlValidator]], //Validators.required
      day: [null, [this.controlValidator]], //Validators.required
    },
      {
        validators: this.formGroupValidators
      });
  }

  private initValue() {
    let date = null;

    if (!!this.dataValue) {
      if (this.dataValue instanceof Date) {
        date = this.dataValue;
      } else if (typeof this.dataValue == "string") {
        date = new Date(this.dataValue);
      }
      this.setDayMonthYearModels(date);
      this.setNgModel(UtilsService.getFormattedDateInstance(date, this.format));
    }
    else {
      if (!!this.default.Year) {
        this.year = this.default.Year;
        this.onYearChange(this.yearDropdown);
      }
      this.setNgModel();
    }
  }

  private initialize() {
    if (!this.required) { this.required = false; }
    if (!this.noAsterisk) { this.noAsterisk = false; }
    if (!this.watermarks) {
      let asterisk = this.required && !this.noAsterisk ? ' *' : '';
      this.watermarks = { Day: 'datePicker.day', Month: 'datePicker.month', Year: 'datePicker.year' };
    }
    if (!this.labels) {
      this.labels = {
        Day: 'datePicker.day', Month: 'datePicker.month', Year: 'datePicker.year'
      };
    }
    if (!this.oldestYear) { this.oldestYear = 100; }
    if (!this.youngestYear) { this.youngestYear = 0; }
    if (!this.hideHints) { this.showHints = true; } else { this.showHints = !this.hideHints; }
    if (!this.format) { this.format = "dd/MM/yyyy"; }
    if (!this.default) { this.default = { Day: null, Month: null, Year: null } }
    this._dayOptions = [];
    this._monthOptions = [];
    this._yearOptions = [];

    this.initValue();
    this.refreshDays();
    this.refreshMonth();
    this.refreshYear();
  }

  private addListeners() {
    this.subscriptions = this.dobFormGroup.valueChanges.subscribe(value => {
      const output = this.responseMapper(value);
      this.onChangeCallback(output);
      this.onTouchedCallback();
    })
  }
  //#endregion initialization

  //#region private methods
  //#endregion private methods

  //#region Validation
  public isValid(year, month, day) {
    let valid = month > 0 && month <= 12 && day > 0 && day <= this.getNbOfDaysInMonth(year, month);
    if (!valid) {
      this.showHints = true;
    }
    return valid;
  }
  //#endregion

  //#region public methods
  public controlValueChanged(value) {
    // console.log(value);
  }

  public isFormValid(): boolean {
    return this.dobFormGroup.valid;
  }

  public reset() {
    // To reset the touched state: It's important to reset the formGroup containing the dateOfBirth Control in addition to this dropdownFormGroup reset
    // ex: this._formGroup.reset();
    this.dataValue = null;
    this.day = null;
    this.month = null;
    this.year = null;
    this._dobFormGroup.controls.year.setErrors(null);
    this._dobFormGroup.controls.month.setErrors(null);
    this._dobFormGroup.controls.day.setErrors(null);
    this._dobFormGroup.reset(); // reset touched state on dropdown's formGroup after triggering reset method
  }
  //#endregion public methods

  //#region change handlers
  public onDayChange(dropdown: Dropdown, value?: any) {
    dropdown.resetFilter();
    this.onFieldChange(); // Called in validators > to avoid multiple calls
  }

  public onMonthChange(dropdown: Dropdown, value?: any) {
    dropdown.resetFilter();
    this.onFieldChange(); // Called in validators > to avoid multiple calls
    this.refreshDays();
  }

  public onYearChange(dropdown: Dropdown, value?: any) {
    dropdown.resetFilter();
    this.onFieldChange(); // Called in validators > to avoid multiple calls
    this.refreshDays();
    this.refreshMonth();
  }

  public onChangeInternal() {
    this.changeHandler.emit(this.dobFormGroup.getRawValue());
  }
  //#endregion change handlers
}
