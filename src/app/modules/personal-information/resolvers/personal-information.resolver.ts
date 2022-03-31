import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { PaymentValidityResolver } from "src/app/shared/resolvers/payment-validity.resolver";
import { PaymentConstants } from "../../offers/constants/payment.constants";
import { GetBeneficiariesResult } from "../models/get-beneficiaries-result.model";
import { BeneficiaryService } from "../services/beneficiary.service";

@Injectable()
export class PersonalInformationResolver implements Resolve<GetBeneficiariesResult>{
    constructor(
        private _pymentValidityResolver: PaymentValidityResolver,
        private _beneficiaryService: BeneficiaryService,
        private _router: Router
    ) { }
    async resolve(route: ActivatedRouteSnapshot): Promise<GetBeneficiariesResult> {
        const quoteId = route.params[AppConstants.ROUTE_DATA_KEYS.QUOTE_ID];
        const paymentValidationResult = await this._pymentValidityResolver.resolve(route).toPromise();
        // Paid => resolve beneficiaries and continue
        if (paymentValidationResult.paid) {
            const beneficiariesResult = await this._beneficiaryService.getBeneficiaries(quoteId).toPromise();
            return beneficiariesResult;
        }
        // Unpaid => redirect to checkout screen
        this._router.navigate([AppConstants.ROUTES.MAIN, AppConstants.ROUTES.OFFERS, AppConstants.ROUTES.CHECKOUT, quoteId, PaymentConstants.PaymentStatus.PAYMENT_FAILED])
        return null;
    }
}