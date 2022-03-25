import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { ValidationError } from "src/app/shared/models/common.model";
import { PaymentConstants } from "../../offers/constants/payment.constants";
import { PaymentService } from "../../offers/services/payment.service";
import { ValidatePaymentResult } from "../components/models/validate-payment-result.model";

Injectable()
export class PaymentValidityResolver implements Resolve<ValidatePaymentResult> {
    constructor(public paymentService: PaymentService) { }
    resolve(route: ActivatedRouteSnapshot): Observable<ValidatePaymentResult> {
        return new Observable<ValidatePaymentResult>((observer) => {
            const quoteId = route.data[AppConstants.ROUTE_DATA_KEYS.QUOTE_ID];
            if (!quoteId) {
                const error = new ValidationError();
                error.code = PaymentConstants.PaymentErrorCodes.MISSING_QUOTE_ID;
                const result = new ValidatePaymentResult();
                result.errors = [error];
                observer.next(result);
                observer.complete();
            }
            else {
                this.paymentService.validate(quoteId).subscribe((result) => {
                    observer.next(result);
                    observer.complete();
                });
            }
        })

    }

}