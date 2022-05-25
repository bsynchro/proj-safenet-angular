import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { ValidatePaymentResult, ValidationError } from "src/app/shared/models/common.model";
import { PaymentConstants } from "../../modules/offers/constants/payment.constants";
import { PaymentService } from "../../modules/offers/services/payment.service";

Injectable()
export class PaymentValidityResolver implements Resolve<ValidatePaymentResult> {
    constructor(public paymentService: PaymentService) { }
    resolve(route: ActivatedRouteSnapshot): Observable<ValidatePaymentResult> {
        return new Observable<ValidatePaymentResult>((observer) => {
            const quoteId = route.params[AppConstants.ROUTE_DATA_KEYS.QUOTE_ID];
            if (!quoteId) {
                const error = new ValidationError();
                error.code = PaymentConstants.PaymentErrorCodes.MISSING_QUOTE_ID;
                const result = new ValidatePaymentResult();
                result.errors = [error];
                observer.next(result);
                observer.complete();
            }
            else {
                const paymentId = route.queryParams[AppConstants.ROUTE_DATA_KEYS.PAYMENT_ID];
                this.paymentService.validate(quoteId, paymentId).subscribe((result) => {
                    observer.next(result);
                    observer.complete();
                });
            }
        })

    }

}