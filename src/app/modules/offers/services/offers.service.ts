import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from "@bsynchro/services";
import { Observable } from "rxjs/internal/Observable";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { UtilsService } from "src/app/shared/services/utils.service";
import { environment } from "src/environments/environment";
import { AppWizardConstants } from "../../wizard/constants/wizard.constants";
import { OffersConstants } from "../constants/offers.constants";
import { GetOffersPayload, PurchaseOfferPayload, RepriceOffersPayload as RepriceOfferPayload } from "../models/offers-payload.model";
import { Offer } from "../models/offer.model";
import { DimensionInput, OfferResult } from "../models/offer-result.model";
import { Subscriber } from "rxjs/internal/Subscriber";
import { PurchaseOfferResult } from "../models/purchase-offer-result.model";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";


@Injectable()
export class OffersService {
    //#region ctor
    constructor(private _httpClient: HttpClient) { }
    //#endregion

    //#region public methods
    public getOffers(userInfo: any): Observable<OfferResult> {
        return new Observable<OfferResult>((observer) => {
            const payload = this.mapToGetOffersPayload(userInfo);
            this.handleOfferRequest(observer, payload, userInfo, AppConstants.CONTROLLER_NAMES.OFFERS, AppConstants.ACTION_NAMES.GET_OFFERS);
        });
    }

    public repriceOffer(offerCode: string, userInfo: any, entityId: number): Observable<OfferResult> {
        return new Observable<OfferResult>((observer) => {
            const getOffersPayload = this.mapToGetOffersPayload(userInfo)
            const payload = RepriceOfferPayload.fromGetOffersPayload(getOffersPayload, entityId, offerCode);
            this.handleOfferRequest(observer, payload, userInfo, AppConstants.CONTROLLER_NAMES.OFFERS, AppConstants.ACTION_NAMES.REPRICE_OFFER);
        });

    }

    public purchaseOffer(offerCode: string, dimensions: Array<DimensionInput>, userInfo: any, referrer: string, entityId: number): Observable<PurchaseOfferResult> {
        return new Observable<PurchaseOfferResult>((observer) => {
            const payload = this.getPurchaseOfferPayload(offerCode, dimensions, userInfo, referrer, entityId);
            const api = new ApiService(this._httpClient, environment.CRM);
            api.post(AppConstants.CONTROLLER_NAMES.OFFERS, AppConstants.ACTION_NAMES.PURCHASE_OFFER, payload).subscribe((res: any) => {
                const result = res as PurchaseOfferResult;
                LocalStorageService.deleteFromLocalStorage(AppConstants.LOCAL_STORAGE.PURCHASE_OFFER_PAYLOAD);
                LocalStorageService.setInLocalStorage<PurchaseOfferResult>(AppConstants.LOCAL_STORAGE.PURCHASE_OFFER_RESULT, result)
                observer.next(result);
                observer.complete();
            });
        });
    }
    //#endregion

    //#region private methods
    private mapToGetOffersPayload(userInfo: any): GetOffersPayload {
        const payload = new GetOffersPayload();
        // Default values
        payload.withDeductible = userInfo.withDeductible ? userInfo.withDeductible : OffersConstants.WITH_DEDUCIBLE.CODES.YES;
        payload.sportsActivity = userInfo.sportsActivity ? userInfo.sportsActivity : OffersConstants.SPORTS_ACTIVITY.CODES.NO;
        // Saved data
        Object.keys(AppWizardConstants.USER_INFO_PROPERTIES).forEach((key) => {
            switch (AppWizardConstants.USER_INFO_PROPERTIES[key]) {
                case AppWizardConstants.USER_INFO_PROPERTIES.DOB:
                    payload.age = this.getAge(userInfo[AppWizardConstants.USER_INFO_PROPERTIES[key]]);
                    break;
                case AppWizardConstants.USER_INFO_PROPERTIES.TRIP_DURATION:
                    payload.from = userInfo[AppWizardConstants.USER_INFO_PROPERTIES[key]].from;
                    payload.to = userInfo[AppWizardConstants.USER_INFO_PROPERTIES[key]].to;
                    break;
                default:
                    payload[AppWizardConstants.USER_INFO_PROPERTIES[key]] = userInfo[AppWizardConstants.USER_INFO_PROPERTIES[key]];
                    break;
            }
        });
        return payload;
    }

    private getPurchaseOfferPayload(offerCode: string, dimensions: DimensionInput[], userInfo: any, referrer: string, entityId: number): PurchaseOfferPayload {
        const dobObj = userInfo[AppWizardConstants.USER_INFO_PROPERTIES.DOB] as { year: number, month: number, day: number };
        const dob = `${dobObj.day.toString().padStart(2, '0')}-${dobObj.month.toString().padStart(2, '0')}-${dobObj.year.toString()}`;
        const payload = new PurchaseOfferPayload();
        payload.offerCode = offerCode;
        payload.dimensions = dimensions;
        payload.dateOfBirth = dob;
        payload.from = userInfo[AppWizardConstants.USER_INFO_PROPERTIES.TRIP_DURATION].from;
        payload.to = userInfo[AppWizardConstants.USER_INFO_PROPERTIES.TRIP_DURATION].to;
        payload.referrer = referrer;
        payload.entityId = entityId
        return payload;
    }

    private getAge(dob: { year: number, month: number, day: number }): number {
        return UtilsService.getAge(new Date(dob.year, dob.month - 1, dob.day));
    }

    private createOffersDimensions(userInfo: any): Array<DimensionInput> {
        const dimensions = new Array<DimensionInput>();
        const smiDimension = new DimensionInput();
        smiDimension.name = OffersConstants.DIMENSION.NAMES.SMI;
        smiDimension.policyLevel = userInfo;
        dimensions.push(smiDimension);
        return dimensions;
    }

    private handleOfferRequest(observer: Subscriber<OfferResult>, payload: any, userInfo: any, controllerName: string, actionName: string) {
        const api = new ApiService(this._httpClient, environment.CRM);
        api.post(controllerName, actionName, payload).subscribe((res: any) => {
            if (res && res.offers) {
                const result = res as OfferResult;
                if (!result.dimensions) {
                    result.dimensions = this.createOffersDimensions(userInfo);
                }
                observer.next(result);
                observer.complete();
            }
            else {
                const result = new OfferResult();
                result.offers = [];
                result.dimensions = this.createOffersDimensions(userInfo);
                observer.next(result);
                observer.complete();
            }
        });
    }
    //#endregion
}