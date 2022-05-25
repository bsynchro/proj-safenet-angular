import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { CheckoutResolvedData } from "../models/checkout-resolved-data.model";
import { OffersService } from "../services/offers.service";
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