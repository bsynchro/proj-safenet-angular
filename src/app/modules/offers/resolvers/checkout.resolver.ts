import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { IdentityService } from "@bsynchro/services";
import { Observable } from "rxjs/internal/Observable";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";
import { PurchaseOfferPayload } from "../models/offers-payload.model";
import { PurchaseOfferResult } from "../models/purchase-offer-result.model";
import { OffersService } from "../services/offers.service";

@Injectable()
export class CheckoutResolver implements Resolve<PurchaseOfferResult>{
    constructor(public _offersService: OffersService, private _identityService: IdentityService, private _router: Router) { }
    resolve(route: ActivatedRouteSnapshot): Observable<PurchaseOfferResult> | Promise<PurchaseOfferResult> | PurchaseOfferResult {
        const payload = LocalStorageService.getFromLocalStorage<PurchaseOfferPayload>(AppConstants.LOCAL_STORAGE.PURCHASE_OFFER_PAYLOAD);
        // Questions not answered or expired
        if (!payload) {
            // Redirect home
            this._router.navigate([AppConstants.ROUTES.MAIN]);
            return null;
        }
        const userInfo = LocalStorageService.getFromLocalStorage(AppConstants.LOCAL_STORAGE.USER_INFO, null, false);
        return this._offersService.purchaseOffer(payload.offer, payload.dimensions, userInfo);
    }
}