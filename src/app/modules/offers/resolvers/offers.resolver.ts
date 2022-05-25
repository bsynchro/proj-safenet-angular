import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";
import { OfferResult } from "../models/offer-result.model";
import { Offer } from "../models/offer.model";
import { OffersService } from "../services/offers.service";

@Injectable()
export class OffersResolver implements Resolve<OfferResult> {

    constructor(public _offersService: OffersService, private _router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<OfferResult> | Promise<OfferResult> | OfferResult {
        const userInfo = LocalStorageService.getFromLocalStorage(AppConstants.LOCAL_STORAGE.USER_INFO);
        // Questions not answered or expired
        if (!userInfo) {
            // Redirect home
            this._router.navigate([AppConstants.ROUTES.MAIN]);
            return null;
        }
        return this._offersService.getOffers(userInfo);
    }
}