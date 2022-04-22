import { AfterViewInit, Component, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ValidationErrors, ValidatorFn, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataListField, LabelValueObject, UITranslateService } from '@bsynchro/services';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppWizardConstants } from 'src/app/modules/wizard/constants/wizard.constants';
import { DropdownDatePickerComponent } from 'src/app/shared/components/dropdown-date-picker/dropdown-date-picker.component';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { CrmConstants } from 'src/app/shared/constants/crm.constants';
import { PhoneType } from 'src/app/shared/enums/crm.enums';
import { Beneficiary, PhoneNumber } from 'src/app/shared/models/crm.model';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Translations } from 'src/app/shared/services/translation.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { isNullOrUndefined } from 'util';
import { BeneficiariesConstants } from '../../constants/beneficiaries.constants';
import { BeneficiaryService } from '../../services/beneficiary.service';

@Component({
  selector: 'app-personalInformation',
  templateUrl: './personal-Information.component.html',
  styleUrls: ['./personal-Information.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PersonalInformationComponent implements OnInit, AfterViewInit {
  //#region fields
  @ViewChildren('dateOfBirth') dobPickerComponents: QueryList<DropdownDatePickerComponent>;
  private _beneficiariesForm: FormGroup;
  private _principalFormGroup: FormGroup;
  private _spousesFormArray: FormArray;
  private _childrenFormArray: FormArray;
  private _beneficiaries: Array<Beneficiary> = [];
  private _travelType: string;
  private _genderDataList: Array<any> = [];
  private _childrenNumber: number;
  private _spousesNumber: number;
  private _submitClicked: boolean;
  private _formGroupValidators: Array<ValidatorFn> = [];
  private _languageSubscription: Subscription = new Subscription();

  public readonly PRINCIPAL = BeneficiariesConstants.Relation.PRINCIPAL;
  public readonly SPOUSE = BeneficiariesConstants.Relation.SPOUSE;
  public readonly CHILD = BeneficiariesConstants.Relation.CHILD;
  public countryOptions: Array<LabelValueObject> = [];

  private mobileNumberValidationFn: () => ValidationErrors | null;
  //#endregion

  //#region getters

  public get beneficiariesForm(): FormGroup {
    return this._beneficiariesForm;
  }

  public get principalFormGroup(): FormGroup {
    return this._principalFormGroup;
  }

  public get spousesFormArray(): FormArray {
    return this._spousesFormArray;
  }

  public get childrenFormArray(): FormArray {
    return this._childrenFormArray;
  }

  public get isFamily(): boolean {
    return this._travelType == AppWizardConstants.TRAVEL_TYPES.CODES.FAMILY;
  }

  public get canAddSpouse(): boolean {
    return this._spousesFormArray && this._spousesFormArray.length < BeneficiariesConstants.NumberOfBeneficiariesLimit.SPOUSE;
  }

  public get canAddChild(): boolean {
    return this._childrenFormArray && this._childrenFormArray.length < BeneficiariesConstants.NumberOfBeneficiariesLimit.CHILD;
  }

  public get showGlobalValidation(): boolean {
    return this.isFamily && this._childrenNumber < 1 && this._spousesNumber < 1;
  }

  public get submitClicked(): boolean {
    return this._submitClicked;
  }

  public get formGroupValidators(): Array<ValidatorFn> {
    return this._formGroupValidators;
  }
  //#endregion

  //#region ctor
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _beneficiaryService: BeneficiaryService,
    private _translateService: UITranslateService,
    public translations: Translations,
    private _fb: FormBuilder
  ) { }
  //#endregion

  //#region lifecycle hooks
  ngOnInit() {
    this.setBeneficiaries();
    this.setTravelType();
    this.initForm();
    this.tryToSetCountries();
    this.handleLanguageChange();
  }

  ngAfterViewInit(): void {
    if (this.dobPickerComponents && this.dobPickerComponents.length) {
      let spousesCount = 0;
      let childrenCount = 0;
      this.dobPickerComponents.forEach((component, i) => {
        let count = 0;
        switch (component.reference) {
          case BeneficiariesConstants.Relation.PRINCIPAL:
            return;
          case BeneficiariesConstants.Relation.SPOUSE:
            spousesCount++;
            count = spousesCount - 1;
            break;
          case BeneficiariesConstants.Relation.CHILD:
            childrenCount++;
            count = childrenCount - 1;
            break;
          default:
            throw new Error(`Invalid relation ${component.reference} in DOB Picker Components.`);
        }
        const beneficiaryFormGroup = this.getFormGroup(component.reference, count);
        const dob: string = beneficiaryFormGroup.get(BeneficiariesConstants.Properties.DATE_OF_BIRTH).value; // dd-MM-yyyy
        const dobFormValue = this.getDatePickerValue(dob);
        component.dobFormGroup.patchValue(dobFormValue);
      });
    }
  }

  //#endregion

  //#region public methods
  public addSpouse() {
    if (this.canAddSpouse) {
      let formGroup = this.createBeneficiaryFormGroup(BeneficiariesConstants.Relation.SPOUSE);
      this._spousesFormArray.push(formGroup);
      this._spousesNumber++;
    }
  }

  public addChild() {
    if (this.canAddChild) {
      let formGroup = this.createBeneficiaryFormGroup(BeneficiariesConstants.Relation.CHILD);
      this._childrenFormArray.push(formGroup);
      this._childrenNumber++;
    }
  }

  public removeBeneficiary(relation: string, index: number) {
    switch (relation) {
      case BeneficiariesConstants.Relation.SPOUSE:
        this._spousesFormArray.removeAt(index);
        this._spousesNumber--;
        break;
      case BeneficiariesConstants.Relation.CHILD:
        this._childrenFormArray.removeAt(index);
        this._childrenNumber--;
        break;
      default:
        throw new Error(`Attempting to remove beneficiary with invalid relation: ${relation}`);
    }
  }

  public async submit() {
    this._submitClicked = true;
    if (this._beneficiariesForm.valid) {
      const beneficiaries = this.mapFormToBeneficiaries();
      const quoteId = this._activatedRoute.snapshot.paramMap.get(AppConstants.ROUTE_DATA_KEYS.QUOTE_ID);
      const result = await this._beneficiaryService.upsertBeneficiaries(quoteId, beneficiaries).toPromise();
      if (result) {
        this._router.navigate([AppConstants.ROUTES.MAIN, AppConstants.ROUTES.POLICY, quoteId]);
      }
    }
  }

  public onDobChange(event: any, relation: string, index: number) {
    if (this.dobPickerComponents && this.dobPickerComponents.length) {
      const dobPickerComponent = this.dobPickerComponents.toArray().filter(c => c.reference == relation)[index];
      const rawDob = dobPickerComponent.dobFormGroup.getRawValue();
      const dob = this.getFormattedDate(rawDob);
      const formGroupToUpdate = this.getFormGroup(relation, index);
      formGroupToUpdate.get(BeneficiariesConstants.Properties.DATE_OF_BIRTH).setValue(dob);
      formGroupToUpdate.updateValueAndValidity();
    }
  }

  public setMobileNumberValidationFn(event) {
    this.mobileNumberValidationFn = event;
  }
  //#endregion

  //#region private methods
  private setBeneficiaries() {
    const routeResolversData = this._activatedRoute.snapshot.data;
    if (routeResolversData) {
      this._beneficiaries = routeResolversData.beneficiariesResult && routeResolversData.beneficiariesResult.beneficiaries ?
        routeResolversData.beneficiariesResult.beneficiaries :
        [];
    }
  }

  private setTravelType() {
    const routeResolversData = this._activatedRoute.snapshot.data;
    if (routeResolversData && routeResolversData.beneficiariesResult && routeResolversData.beneficiariesResult.additionalData) {
      this._travelType = routeResolversData.beneficiariesResult.additionalData[CrmConstants.QUOTE_PRODUCT_EXTENDED_PROPERTIES.TRAVEL_TYPE];
    }
  }

  private initForm() {
    this._principalFormGroup = this.mapPrincipalToFormGroup();
    this._spousesFormArray = this.mapSpousesToFormArray();
    this._childrenFormArray = this.mapChildrenToFormArray();
    this._beneficiariesForm = this._fb.group({
      principal: this._principalFormGroup,
      spouses: this._spousesFormArray,
      children: this._childrenFormArray,
    });
  }

  private mapPrincipalToFormGroup(): FormGroup {
    let formGroup = this.createBeneficiaryFormGroup(BeneficiariesConstants.Relation.PRINCIPAL);
    const principal = this._beneficiaries.find(b => b.relation && b.relation.code == BeneficiariesConstants.Relation.PRINCIPAL);
    if (principal) {
      formGroup = this.mapBeneficiaryToFormGroup(principal)
    }
    return formGroup;
  }

  private createBeneficiaryFormGroup(relation: string): FormGroup {
    const formGroup = this._fb.group(
      {
        id: [null],
        firstName: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
        countryOfResidence: relation == BeneficiariesConstants.Relation.PRINCIPAL ? [null, [Validators.required]] : [null],
        passportNumber: [null, [Validators.required, this.passportNumberValidatorFn]],
        gender: [true, [Validators.required]],
        mobileNumber: relation == BeneficiariesConstants.Relation.PRINCIPAL ? [null, [Validators.required]] : [null],
        destinationCountry: relation == BeneficiariesConstants.Relation.PRINCIPAL ? [null, [Validators.required]] : [null],
        dateOfBirth: relation == BeneficiariesConstants.Relation.PRINCIPAL ?
          [null] :
          relation == BeneficiariesConstants.Relation.CHILD ?
            [null, [Validators.required, this.childMaxAgeValidator]] :
            [null, [Validators.required]],
        maritalStatus: [null],
        email: relation == BeneficiariesConstants.Relation.PRINCIPAL ? [null, [Validators.required, Validators.email]] : [null],
        relation: [relation]
      },
      { updateOn: 'blur' }
    );
    switch (relation) {
      case BeneficiariesConstants.Relation.PRINCIPAL:
        formGroup.setValidators(this.isMobileNumberValid);
        break;
      default:
        break;
    }
    return formGroup;
  }

  private mapSpousesToFormArray(): FormArray {
    this._spousesFormArray = this._fb.array([]);
    const spouses = this._beneficiaries.filter(b => b.relation && b.relation.code == BeneficiariesConstants.Relation.SPOUSE);
    spouses.forEach((spouse) => {
      const spouseFormGroup = this.mapBeneficiaryToFormGroup(spouse);
      this._spousesFormArray.push(spouseFormGroup);
    });
    this._spousesNumber = spouses.length;
    return this._spousesFormArray;
  }

  private mapChildrenToFormArray(): FormArray {
    this._childrenFormArray = this._fb.array([]);
    const children = this._beneficiaries.filter(b => b.relation && b.relation.code == BeneficiariesConstants.Relation.CHILD);
    children.forEach((chid) => {
      const childFormGroup = this.mapBeneficiaryToFormGroup(chid);
      this._childrenFormArray.push(childFormGroup);
    });
    this._childrenNumber = children.length;
    return this._childrenFormArray;
  }

  private mapBeneficiaryToFormGroup(beneficiary: Beneficiary): FormGroup {
    const formGroup = this.createBeneficiaryFormGroup(beneficiary.relation.code);
    Object.keys(beneficiary).forEach((key) => {
      switch (key) {
        case BeneficiariesConstants.Properties.COUNTRY_OF_RESIDENCE:
        case BeneficiariesConstants.Properties.DESTINATION_COUNTRY:
        case BeneficiariesConstants.Properties.MARITAL_STATUS:
        case BeneficiariesConstants.Properties.RELATION:
          formGroup.get(key).setValue(beneficiary[key] && beneficiary[key].code ? beneficiary[key].code : null);
          break;
        case BeneficiariesConstants.Properties.MOBILE_NUMBER:
          formGroup.get(key).setValue(beneficiary[key] && beneficiary[key].number ? beneficiary[key].number : null);
          break;
        case BeneficiariesConstants.Properties.GENDER:
          const gender = beneficiary[key] ? beneficiary[key].code : null;
          formGroup.get(key).setValue(isNullOrUndefined(gender) || gender == AppConstants.DATA_LIST_CODES.GENDER.MALE);
          break;
        default:
          formGroup.get(key).setValue(beneficiary[key]);
          break;
      }
    });
    return formGroup;
  }

  private handleLanguageChange() {
    this._languageSubscription.unsubscribe();
    this._languageSubscription = this._translateService.onLanguageChange.subscribe(res => {
      this.loadDataLists();
    });
  }

  private loadDataLists() {
    const routeResolversData = this._activatedRoute.snapshot.data;
    if (routeResolversData) {
      const datalists = this._translateService.getLocalizedDataLists(routeResolversData.dataLists);
      this._genderDataList = datalists.find((d) => d[0].dataListName === AppConstants.DATA_LIST_NAMES.GENDER);

      const countryDataList = datalists.find((d) => d[0].dataListName === AppConstants.DATA_LIST_NAMES.COUNTRY);
      this.setCountryOptions(countryDataList);
    }
  }

  private setCountryOptions(countryDataList: Array<any>) {
    if (countryDataList) {
      this.countryOptions = countryDataList.map(d => new LabelValueObject({
        label: d.title,
        value: d.code
      }));
    }
  }

  private mapFormToBeneficiaries() {
    const beneficiaries = new Array<Beneficiary>();
    const principal = this.mapFormToBeneficiary(this._principalFormGroup);
    beneficiaries.push(principal);
    this._spousesFormArray.controls.forEach((control) => {
      const spouse = this.mapFormToBeneficiary(control as FormGroup);
      beneficiaries.push(spouse);
    });
    this._childrenFormArray.controls.forEach((control) => {
      const child = this.mapFormToBeneficiary(control as FormGroup);
      beneficiaries.push(child);
    });
    return beneficiaries;
  }

  private mapFormToBeneficiary(formGroup: FormGroup): Beneficiary {
    const beneficiary = new Beneficiary();
    Object.values(BeneficiariesConstants.Properties).forEach((key) => {
      switch (key) {
        case BeneficiariesConstants.Properties.COUNTRY_OF_RESIDENCE:
        case BeneficiariesConstants.Properties.DESTINATION_COUNTRY:
        case BeneficiariesConstants.Properties.MARITAL_STATUS:
        case BeneficiariesConstants.Properties.RELATION:
          beneficiary[key] = new DataListField(formGroup.get(key).value);
          break;
        case BeneficiariesConstants.Properties.GENDER:
          beneficiary[key] = new DataListField(
            formGroup.get(key).value ?
              AppConstants.DATA_LIST_CODES.GENDER.MALE :
              AppConstants.DATA_LIST_CODES.GENDER.FEMALE
          );
          break;
        case BeneficiariesConstants.Properties.MOBILE_NUMBER:
          const mobileNumber = new PhoneNumber();
          mobileNumber.number = formGroup.get(key).value;
          mobileNumber.phoneType = PhoneType.Phone;
          beneficiary[key] = mobileNumber;
          break;
        default:
          beneficiary[key] = formGroup.get(key).value;
          break;
      }
    });
    return beneficiary;
  }

  private getFormattedDate(formValue: any): string {
    let day = !isNullOrUndefined(formValue.day) ? formValue.day.toString() : null;
    let month = !isNullOrUndefined(formValue.month) ? formValue.month.toString() : null;
    let year = !isNullOrUndefined(formValue.year) ? formValue.year.toString() : null;
    if (!isNullOrUndefined(day)) {
      day = day.padStart(2, '0');
    }
    if (!isNullOrUndefined(month)) {
      month = month.padStart(2, '0');
    }
    return `${day}-${month}-${year}`;
  }

  /**
   * 
   * @param dob dd-MM-yyyy
   */
  private getDatePickerValue(dob: string) {
    const splittedDate = dob.split('-');
    return {
      day: parseInt(splittedDate[0]),
      month: parseInt(splittedDate[1]),
      year: parseInt(splittedDate[2])
    };
  }

  private getFormGroup(relation: string, index: number): FormGroup {
    let formGroup: FormGroup = null;
    switch (relation) {
      case BeneficiariesConstants.Relation.PRINCIPAL:
        formGroup = this.principalFormGroup;
        break;
      case BeneficiariesConstants.Relation.SPOUSE:
        formGroup = this._spousesFormArray.at(index) as FormGroup;
        break;
      case BeneficiariesConstants.Relation.CHILD:
        formGroup = this._childrenFormArray.at(index) as FormGroup;
        break;
      default:
        throw new Error(`Invalid relation ${relation} in DOB change listener.`);
    }
    return formGroup;
  }

  private tryToSetCountries() {
    const countryOfArrival = LocalStorageService.getFromLocalStorage(AppConstants.LOCAL_STORAGE.COUNTRY_OF_ARRIVAL, null, false);
    const countryOfDeparture = LocalStorageService.getFromLocalStorage(AppConstants.LOCAL_STORAGE.COUNTRY_OF_DEPARTURE, null, false);
    const principalFormGroup = this._beneficiariesForm.get('principal') as FormGroup;
    const countryOfResidenceControl = principalFormGroup.get(BeneficiariesConstants.Properties.COUNTRY_OF_RESIDENCE);
    const destinationCountryControl = principalFormGroup.get(BeneficiariesConstants.Properties.DESTINATION_COUNTRY);
    if (countryOfDeparture) {
      countryOfResidenceControl.setValue(countryOfDeparture);
      countryOfResidenceControl.disable();
    }
    if (countryOfArrival) {
      destinationCountryControl.setValue(countryOfArrival);
      destinationCountryControl.disable();
    }
  }

  private getAge(date: string): number {
    if (date) {
      const splittedDate = date.split('-');
      if (splittedDate.length == 3 && splittedDate.every(part => part && part != 'null')) {
        const dob = new Date(parseInt(splittedDate[2]), parseInt(splittedDate[1]) - 1, parseInt(splittedDate[0]));
        return UtilsService.getAge(dob);
      }
    }
    return null;
  }

  //#region validation
  private isMobileNumberValid = (): ValidationErrors | null => {
    if (
      !isNullOrUndefined(this.mobileNumberValidationFn)
    ) {
      return this.mobileNumberValidationFn.apply(this);
    }
    return null;
  }

  private passportNumberValidatorFn: ValidatorFn = (control: FormControl) => {
    if (control.value) {
      return control.value.length != 9 ? { invalidPassportNumber: true } : null;
    }
    return null;
  }

  private childMaxAgeValidator: ValidatorFn = (control: FormControl) => {
    if (control && control.value) {
      const age = this.getAge(control.value);
      if (!age) {
        return { required: true };
      }
      control.markAsTouched();
      return age > 18 ? { invalidChildAge: true } : null;
    }
    return null;
  }
  //#endregion
  //#endregion
}
