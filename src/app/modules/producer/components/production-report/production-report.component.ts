import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ApiService } from '@bsynchro/services';
import * as saveAs from 'file-saver';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { Translations } from 'src/app/shared/services/translation.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { tap } from 'rxjs/internal/operators/tap';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { TravelProductionReportPayload } from '../../models/travel-production-eport-payload.model';
import { ExportFilter } from 'src/app/shared/models/export-filter.model';

@Component({
  selector: 'app-production-report',
  templateUrl: './production-report.component.html',
  styleUrls: ['./production-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductionReportComponent implements OnInit, AfterViewInit {
  //#region Views
  @ViewChild('fromCalendar', { static: false }) private _fromCalendar: any;
  @ViewChild('toCalendar', { static: false }) private _toCalendar: any;
  //#endregion

  //#region fields
  private _dateFormGroup: FormGroup;
  private _todayDate: Date = new Date();
  private _printDateFormat: string = 'dd-MM-yyyy';
  private _dateFormat: string = 'dd/MM/yyyy';
  //#endregion

  //#region getters
  public get calendarDateFormat(): string {
    return AppConstants.CALENDAR.DATE_FORMAT;
  }

  public get dateFormGroup(): FormGroup {
    return this._dateFormGroup;
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
      null;
  }
  //#endregion

  //#region setters
  //#endregion

  //#region ctor
  constructor(
    private _fb: FormBuilder,
    private _httpClient: HttpClient,
    private _loaderService: LoaderService,
    private _userService: UserService,
    public translations: Translations
  ) {
  }
  //#endregion

  //#region lifecycle hooks
  ngOnInit() {
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.formControlHasValue('from')) {
        this.showCalendar(this._fromCalendar);
      }
      else {
        if (!this.formControlHasValue('to')) {
          this.showCalendar(this._toCalendar);
        }
      }
    }, 10);
  }
  //#endregion

  //#region public methods
  public onValueChange() {
    this._dateFormGroup.updateValueAndValidity();
  }

  public onFromDateValueChange() {
    if (!this.formControlHasValue('to')) {
      this.showCalendar(this._toCalendar);
    }
    this.onValueChange();
  }

  public async download() {
    if (this._dateFormGroup.valid) {
      this._loaderService.showManualLoader();
      const apiService = new ApiService(this._httpClient, environment.CRM);
      const payload = await this.getReportPayload();
      const fileName = this.getReportFileName();
      await apiService.post(
        AppConstants.CONTROLLER_NAMES.PRODUCTION_REPORTS,
        AppConstants.ACTION_NAMES.TRAVEL,
        payload,
        {},
        { responseType: 'blob' }
      ).toPromise<any>()
        .then((response: any) => {
          saveAs(response, fileName);
          this._loaderService.hideManualLoader();
        })
        .catch(error => this.handleHttpError(error));
    }
  }
  //#endregion

  //#region private methods
  private initializeForm() {
    this._dateFormGroup = this._fb.group({
      from: [null, [Validators.required]],
      to: [null, [Validators.required]]
    });
    this._dateFormGroup.setValidators(this.dateValidator);
  }

  private dateValidator: ValidatorFn = (group: FormGroup) => {
    if (group.get('from').value && group.get('to').value) {
      return group.get('from').value <= group.get('to').value ? null : { invalidDate: true };
    }
  }

  private showCalendar(calendar: any) {
    setTimeout(() => calendar.showOverlay(), 10);
  }

  private formControlHasValue(formControlName: string): boolean {
    return this._dateFormGroup && this._dateFormGroup.get(formControlName) && this._dateFormGroup.get(formControlName).value;
  }

  private getReportFileName(): string {
    const from: Date = this._dateFormGroup.get('from').value;
    const to: Date = this._dateFormGroup.get('to').value;
    const formattedFromDate = UtilsService.getFormattedDateInstance(from, this._printDateFormat);
    const formattedToDate = UtilsService.getFormattedDateInstance(to, this._printDateFormat);
    return `Basma_Travel Production_Report_${formattedFromDate}_${formattedToDate}`
  }

  private async getReportPayload(): Promise<TravelProductionReportPayload> {
    const user = await this._userService.loggedInUser.toPromise()
      .catch(error => this.handleHttpError(error));
    const channel = user.properties.find(p => p.name == AppConstants.USER_PROPERTIES.CHANNEL);
    const payload = new TravelProductionReportPayload();
    payload.from = UtilsService.getFormattedDateInstance(this._dateFormGroup.get('from').value, this._dateFormat);
    payload.to = UtilsService.getFormattedDateInstance(this._dateFormGroup.get('to').value, this._dateFormat);
    payload.channel = channel ? channel.value : null;
    payload.entityIds = user.entityId;
    payload.filters = new Array<ExportFilter>();
    return payload;
  }

  private handleHttpError(error: HttpErrorResponse): Observable<any> {
    console.log(error);
    this._loaderService.hideManualLoader();
    return throwError(error.message || "server error.");
  }
  //#endregion
}
