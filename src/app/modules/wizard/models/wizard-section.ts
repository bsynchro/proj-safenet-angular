import { HostBinding, Input } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Step, UITranslateService } from "@bsynchro/services";
import { Subscription } from "rxjs";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";

export abstract class WizardSection extends Step {
    //#region decorators
    @HostBinding('class.hidden') public classHidden: boolean;
    //#endregion

    //#region fields
    public dataList: Array<any> = [];
    public formGroup: FormGroup;
    private _languageSubscription: Subscription = new Subscription();
    //#endregion

    //#region ctor
    constructor(
        public activatedRoute: ActivatedRoute,
        public translateService: UITranslateService,
        public fb: FormBuilder
    ) {
        super();
    }
    //#endregion

    //#region abstract
    public abstract dataListName: string;
    public abstract get userInfoPropertyName(): string;
    public abstract validator: ValidatorFn;
    //#endregion

    //#region overrides
    public initialize(input: any): void {
        if (!input) {
            input = {
                order: this.order
            };
        }
        super.initialize(input);
        this.input = input;
        this.loadDataLists();
        this.initializeFormGroup();
    }

    public get hidden(): boolean {
        return this.classHidden;
    }

    public set hidden(v: boolean) {
        this.classHidden = v;
    }

    public isValid(): boolean {
        return this.formGroup &&
            this.formGroup.get(this.userInfoPropertyName) &&
            this.formGroup.get(this.userInfoPropertyName).valid;
    }
    //#endregion

    //#region methods
    public loadDataLists() {
        if (this.dataListName) {
            this._languageSubscription.unsubscribe();
            this._languageSubscription = this.translateService.onLanguageChange.subscribe(res => {
                const routeResolversData = this.activatedRoute.snapshot.data;
                if (routeResolversData) {
                    const datalists = this.translateService.getLocalizedDataLists(routeResolversData.dataLists);
                    this.dataList = datalists.find((d) => d[0].dataListName === this.dataListName);
                }
            });
        }
    }

    public selectAnswer(value: any) {
        if (!this.userInfoPropertyName) {
            throw new Error(`userInfoPropertyName not set for section ${this.name}`);
        }
        this.formGroup.get(this.userInfoPropertyName).setValue(value);
        this.formGroup.updateValueAndValidity();
        LocalStorageService.setInLocalStorage(AppConstants.LOCAL_STORAGE.USER_INFO, this.formGroup.getRawValue(), AppConstants.LOCAL_STORAGE.DEFAULT_TTL);
    }

    public isSelected(code: string): boolean {
        return this.formGroup &&
            this.formGroup.get(this.userInfoPropertyName) &&
            this.formGroup.get(this.userInfoPropertyName).value == code;
    }

    private initializeFormGroup() {
        if (!this.userInfoPropertyName) {
            throw new Error(`userInfoPropertyName not set for section ${this.name}`);
        }
        if (!this.formGroup) {
            this.formGroup = this.fb.group({})
        }
        if (!this.formGroup.get(this.userInfoPropertyName)) {
            this.formGroup.addControl(this.userInfoPropertyName, this.fb.control(null, [this.validator]));
        }
        const savedFormGroup = LocalStorageService.getFromLocalStorage(AppConstants.LOCAL_STORAGE.USER_INFO);
        if (savedFormGroup) {
            this.formGroup.patchValue(savedFormGroup);
            this.formGroup.updateValueAndValidity();
        }
    }
    //#endregion
}