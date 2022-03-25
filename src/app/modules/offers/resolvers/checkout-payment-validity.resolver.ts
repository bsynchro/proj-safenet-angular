import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { ValidationError } from "src/app/shared/models/common.model";
import { ValidatePaymentResult } from "../../personal-information/components/models/validate-payment-result.model";
import { PaymentValidityResolver } from "../../personal-information/resolvers/payment-validity.resolver";
import { PaymentConstants } from "../constants/payment.constants";

@Injectable()
export class CheckoutPaymentValidityResolver extends PaymentValidityResolver {
    resolve(route: ActivatedRouteSnapshot): Observable<ValidatePaymentResult> {
        return new Observable<ValidatePaymentResult>((observer) => {
            // Check payment flag
            const paymentFlag = route.params[AppConstants.ROUTE_DATA_KEYS.PAYMENT_FLAG];
            // If payment failed
            if (paymentFlag && paymentFlag == PaymentConstants.PaymentStatus.PAYMENT_FAILED) {
                // Try to get error code
                const paymentErrorCode = route.params[AppConstants.ROUTE_DATA_KEYS.PAYMENT_ERROR_CODE];
                // If no error code
                if (!paymentErrorCode) {
                    // Get payment validity
                    super.resolve(route).subscribe((result) => {
                        observer.next(result);
                        observer.complete();
                    });
                }
                else {
                    const error = new ValidationError();
                    error.code = paymentErrorCode;
                    const result = new ValidatePaymentResult();
                    result.errors = [error];
                    observer.next(result);
                    observer.complete();
                }
            }
            else {
                observer.next(null);
                observer.complete();
            }
        });
    }
}