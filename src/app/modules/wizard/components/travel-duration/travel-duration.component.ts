import { AfterViewInit, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UITranslateService } from '@bsynchro/services';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { Subscription } from 'rxjs/internal/Subscription';
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
export class TravelDurationComponent extends WizardSection implements OnInit, AfterViewInit {
  //#region decorators
  @Input() public formGroup: FormGroup;
  //#endregion

  //#region Views
  @ViewChild('fromCalendar', { static: false }) private _fromCalendar: any;
  @ViewChild('toCalendar', { static: false }) private _toCalendar: any;
  //#endregion

  //#region fields
  private _todayDate: Date = new Date();
  private _dateFormGroup: FormGroup;
  private _visibilitySubscription: Subscription = new Subscription();
  private _viewInitReplaySubject: ReplaySubject<any> = new ReplaySubject<any>();
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
    this.handleVisibilityChange();
  }
  //#endregion

  //#region lifecycle hooks
  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this._viewInitReplaySubject.next(this._fromCalendar);
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
    const dateFormGroup = this.fb.group({
      from: [null, [this.validator]],
      to: [null, [this.validator]]
    });
    this.formGroup.addControl(this.userInfoPropertyName, dateFormGroup);
    this._dateFormGroup = this.formGroup.get(this.userInfoPropertyName) as FormGroup;
    this._dateFormGroup.setValidators(this.dateValidator);
  }

  public updateFormControls(savedFormGroup: any) {
    const dateFormValue = savedFormGroup[this.userInfoPropertyName];
    if (dateFormValue) {
      if (dateFormValue.from) {
        dateFormValue.from = new Date(dateFormValue.from);
      }
      if (dateFormValue.to) {
        dateFormValue.to = new Date(dateFormValue.to);
      }
      super.updateFormControls(savedFormGroup);
    }
  }
  //#endregion

  //#region public methods
  public onValueChange() {
    this.selectAnswer(this._dateFormGroup.getRawValue());
  }

  public onFromDateValueChange() {
    if (!this.formControlHasValue('to')) {
      this.showCalendar(this._toCalendar);
    }
    this.onValueChange();
  }
  //#endregion

  //#region private methods
  private dateValidator: ValidatorFn = (group: FormGroup) => {
    if (group.get('from').value && group.get('to').value) {
      return group.get('from').value < group.get('to').value ? null : { invalidDate: true };
    }
  }

  private handleVisibilityChange() {
    this._visibilitySubscription.unsubscribe();
    this._visibilitySubscription = this.visibilityEventEmmiter.subscribe((visible) => {
      if (visible) {
        this._viewInitReplaySubject.subscribe((calendar) => {
          if (calendar) {
            setTimeout(() => {
              if (!this.formControlHasValue('from')) {
                this.showCalendar(calendar);
              }
              else {
                if (!this.formControlHasValue('to')) {
                  this.showCalendar(this._toCalendar);
                }
              }
            }, 10);
          }
        });

      }
    });
  }

  private showCalendar(calendar: any) {
    setTimeout(() => calendar.showOverlay(), 10);
  }

  private formControlHasValue(formControlName: string): boolean {
    return this._dateFormGroup && this._dateFormGroup.get(formControlName) && this._dateFormGroup.get(formControlName).value;
  }
  //#endregion
}
