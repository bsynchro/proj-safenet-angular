import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";
import { PaymentConstants } from "../constants/payment.constants";
import { CheckoutResolvedData } from "../models/checkout-resolved-data.model";
import { PurchaseOfferPayload } from "../models/offers-payload.model";
import { PurchaseOfferResult } from "../models/purchase-offer-result.model";
import { OffersService } from "../services/offers.service";
import { PaymentService } from "../services/payment.service";
import { CheckoutPaymentValidityResolver } from "./checkout-payment-validity.resolver";
import { PurchaseOfferResolver } from "./purchase-offer.resolver";

@Injectable()
export class CheckoutResolver implements Resolve<CheckoutResolvedData>{
    constructor(
        public _offersService: OffersService,
        private _checkoutPaymentValidityResolver: CheckoutPaymentValidityResolver,
        private _purchaseOfferResolver: PurchaseOfferResolver,
        private _router: Router
    ) { }
    async resolve(route: ActivatedRouteSnapshot): Promise<CheckoutResolvedData> {
        const paymentValidationResult = await this._checkoutPaymentValidityResolver.resolve(route).toPromise();
        const purchaseOfferResult = await this._purchaseOfferResolver.resolve(route).toPromise();
        const result = new CheckoutResolvedData();
        result.purchaseOfferResult = purchaseOfferResult;
        if (paymentValidationResult) {
            result.paymentFailed = !paymentValidationResult.paid;
            result.errorCodes = paymentValidationResult.errors.map(e => e.code);
        }
        return result;
    }
}