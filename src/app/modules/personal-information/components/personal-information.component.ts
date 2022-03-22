import { Component, Input, OnInit, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,FormArray, ValidatorFn,Validators } from '@angular/forms';
import { LocalizedValue, UITranslateService } from '@bsynchro/services';
import { appendFile } from 'fs';
import { Translations } from 'src/app/shared/services/translation.service';
import { AppConstants } from "../../../shared/constants/app.constants";

@Component({
  selector: 'app-personalInformation',
  templateUrl: './personal-Information.component.html',
  styleUrls: ['./personal-Information.component.scss']
})
export class PersonalInformationComponent implements OnInit {
//#region fields
  private _beneficiariesForm: FormGroup;
  private _beneficiariesFormArray: FormArray;
  private _countryOptions: Array<any>;
  //#endregion

  public get PRINCIPAL(): string {
    return AppConstants.PRINCIPAL
  }

  public countryOptions():Array<any> {
    return this._countryOptions;
  }

  public get beneficiariesForm(): FormGroup {
    return this._beneficiariesForm;
  }

  public get beneficiariesFormArray(): FormArray {
    return this._beneficiariesFormArray;
  }


  private setCountryOptions() {
    this._countryOptions = [];

  }

  constructor(
    private _translateService: UITranslateService,
    public translations: Translations,
    private _fb: FormBuilder
  ) {   }

  ngOnInit() {
    this._beneficiariesFormArray = this._fb.array([
      this._fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        countryOfResidence: [null, Validators.required],
        passportNumbner: [null, Validators.required],
        gender: [null, Validators.required],
        mobileNumber: [null, Validators.required],
        destinationCountry: [null, Validators.required],
        dateOfBirth: [null, Validators.required],
        type: [this.PRINCIPAL]
      })
    ]);
    this._beneficiariesForm = this._fb.group({
      beneficiaries: this._beneficiariesFormArray
    });
  }
}
