import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, ValidatorFn, Validators } from '@angular/forms';
import { LocalizedValue, UITranslateService } from '@bsynchro/services';
import { Translations } from 'src/app/shared/services/translation.service';
import { AppConstants } from "../../../shared/constants/app.constants";

@Component({
  selector: 'app-personalInformation',
  templateUrl: './personal-Information.component.html',
  styleUrls: ['./personal-Information.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PersonalInformationComponent implements OnInit {
  //#region fields
  private _beneficiariesForm: FormGroup;
  private _beneficiariesFormArray: FormArray;
  private countryOptions = [];
  //#endregion

  public showSpouce: boolean = false;
  public showChildren: boolean = false;
  public childrenCount: number = 0;

  public get PRINCIPAL(): string {
    return AppConstants.PRINCIPAL
  }

  // public countryOptions(): Array<any> {
  //   return this._countryOptions;
  // }

  public get beneficiariesForm(): FormGroup {
    return this._beneficiariesForm;
  }

  public get beneficiariesFormArray(): FormArray {
    return this._beneficiariesFormArray;
  }


  // private setCountryOptions() {
  //   this._countryOptions = [
  //     {
  //       label: "Facultative",
  //       value: 1,
  //     },
  //     {
  //       label: "Treaty",
  //       value: 2,
  //     },
  //   ];
  // }

  constructor(
    private _translateService: UITranslateService,
    public translations: Translations,
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    this.countryOptions = [
      {
        label: "Facultative",
        value: 1,
      },
      {
        label: "Treaty",
        value: 2,
      },
    ];
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

  addSpouse() {
    this.showSpouce = true;
  }

  removeSpouce() {
    this.showSpouce = false;
  }

  addChildren() {
    this.showChildren = true;
    if (this.childrenCount < 6) {
      this.childrenCount++;
    }
  }

  counter(i: number) {
    return new Array(i);
  }

  removeChildren() {
    this.childrenCount--;
  }
}
