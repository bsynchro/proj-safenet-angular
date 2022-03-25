import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { ValidatePaymentResult } from "../../personal-information/components/models/validate-payment-result.model";
import { PaymentValidityResolver } from "../../personal-information/resolvers/personal-information.resolver";
import { PaymentConstants } from "../constants/payment.constants";

@Injectable()
export class CheckoutPaymentValidityResolver extends PaymentValidityResolver {
    resolve(route: ActivatedRouteSnapshot): Observable<ValidatePaymentResult> {
        return new Observable<ValidatePaymentResult>((observer) => {
            // Check payment flag
            const paymentFlag = route.data[AppConstants.ROUTE_DATA_KEYS.PAYMENT_FLAG];
            // If payment failed
            if (paymentFlag && paymentFlag == PaymentConstants.PaymentStatus.PAYMENT_FAILED) {
                // Try to get error code
                const paymentErrorCode = route.data[AppConstants.ROUTE_DATA_KEYS.PAYMENT_ERROR_CODE];
                // If no error code
                if (!paymentErrorCode) {
                    // Get payment validity
                    super.resolve(route).subscribe((result) => {
                        observer.next(result);
                        observer.complete();
                    });
                }
                else {
                    observer.next(null);
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