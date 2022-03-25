import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from "@bsynchro/services";
import { Observable } from "rxjs/internal/Observable";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";
import { UtilsService } from "src/app/shared/services/utils.service";
import { environment } from "src/environments/environment";
import { ValidatePaymentResult } from "../../personal-information/components/models/validate-payment-result.model";
import { AppWizardConstants } from "../../wizard/constants/wizard.constants";
import { CheckoutPayload } from "../models/checkou-payload.model";
import { CheckoutResult } from "../models/checkout-result.model";
import { PurchaseOfferResult } from "../models/purchase-offer-result.model";

@Injectable()
export class PaymentService {
    //#region ctor
    constructor(private _httpClient: HttpClient) { }
    //#endregion

    //#region public methods
    public checkout(offerCode: string, smiPayload: { [key: string]: any }, userInfo: any, quoteId: string, couponCodes: Array<string>): Observable<string> {
        return new Observable<string>((observer) => {
            const payload = this.getCheckoutPayload(quoteId, couponCodes, offerCode, smiPayload, userInfo);
            const api = new ApiService(this._httpClient, environment.CRM);
            api.post(AppConstants.CONTROLLER_NAMES.PAYMENT, AppConstants.ACTION_NAMES.CHECKOUT, payload).subscribe((res: any) => {
                const result = res as CheckoutResult;
                if (result && result.quote) {
                    // Update quote in cached PurchaseOfferResult
                    const purchaseOfferResult = LocalStorageService.getFromLocalStorage<PurchaseOfferResult>(AppConstants.LOCAL_STORAGE.PURCHASE_OFFER_RESULT, null, false);
                    purchaseOfferResult.quote = result.quote;
                    LocalStorageService.setInLocalStorage<PurchaseOfferResult>(AppConstants.LOCAL_STORAGE.PURCHASE_OFFER_RESULT, purchaseOfferResult);
                }
                observer.next(result.url);
                observer.complete();
            });
        });
    }

    public validate(quoteId: string): Observable<ValidatePaymentResult> {
        return new Observable<ValidatePaymentResult>((observer) => {
            const api = new ApiService(this._httpClient, environment.CRM);
            api.get(AppConstants.CONTROLLER_NAMES.PAYMENT, `${AppConstants.ACTION_NAMES.VALIDATE}/${quoteId}`).subscribe((res: any) => {
                const result = res as ValidatePaymentResult;
                observer.next(result);
                observer.complete();
            });
        });
    }
    //#endregion

    //#region private methods
    private getCheckoutPayload(quoteId: string, couponCodes: string[], offerCode: string, smiPayload: { [key: string]: any }, userInfo: any): CheckoutPayload {
        const payload = new CheckoutPayload();
        payload.quoteId = quoteId;
        payload.couponCodes = couponCodes;
        payload.offerCode = offerCode;
        // Add user info to payload
        Object.keys(smiPayload).forEach((key) => {
            switch (key) {
                case AppWizardConstants.USER_INFO_PROPERTIES.TRIP_DURATION:
                    payload.from = userInfo[key].from;
                    payload.to = userInfo[key].to;
                    break;
                default:
                    payload[key] = smiPayload[key];
                    break;
            }
        });
        return payload;
    }

    private getAge(dob: { year: number, month: number, day: number }): number {
        return UtilsService.getAge(new Date(dob.year, dob.month, dob.day));
    }
    //#endregion
}