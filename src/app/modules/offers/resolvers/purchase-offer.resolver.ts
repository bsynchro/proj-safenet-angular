import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";
import { PurchaseOfferPayload } from "../models/offers-payload.model";
import { PurchaseOfferResult } from "../models/purchase-offer-result.model";
import { OffersService } from "../services/offers.service";

@Injectable()
export class PurchaseOfferResolver implements Resolve<PurchaseOfferResult>{
    constructor(public _offersService: OffersService, private _router: Router) { }
    resolve(route: ActivatedRouteSnapshot): Observable<PurchaseOfferResult> {
        return new Observable<PurchaseOfferResult>((observer) => {
            // Try to return saved purchase result (if refreshing)
            const purchaseOfferResult = LocalStorageService.getFromLocalStorage<PurchaseOfferResult>(AppConstants.LOCAL_STORAGE.PURCHASE_OFFER_RESULT, null, false);
            if (purchaseOfferResult) {
                observer.next(purchaseOfferResult);
                observer.complete();
            }
            else {
                // Prepare to purchase offer
                const payload = LocalStorageService.getFromLocalStorage<PurchaseOfferPayload>(AppConstants.LOCAL_STORAGE.PURCHASE_OFFER_PAYLOAD);
                // Questions not answered or expired
                if (!payload) {
                    // Redirect home
                    this._router.navigate([AppConstants.ROUTES.MAIN]);
                    observer.next(null);
                    observer.complete();
                }
                // Purchase offer payload exists
                else {
                    const userInfo = LocalStorageService.getFromLocalStorage(AppConstants.LOCAL_STORAGE.USER_INFO, null, false);
                    const referrer = LocalStorageService.getFromLocalStorage<string>(AppConstants.LOCAL_STORAGE.REFFERER, null, false);
                    // Call purchase offer
                    this._offersService.purchaseOffer(payload.offerCode, payload.dimensions, userInfo, referrer, payload.entityId).subscribe((result) => {
                        observer.next(result);
                        observer.complete();
                    });
                }
            }
        });
    }
}