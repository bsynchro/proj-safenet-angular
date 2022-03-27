import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { Beneficiary } from "src/app/shared/models/crm.model";
import { PaymentValidityResolver } from "src/app/shared/resolvers/payment-validity.resolver";
import { PaymentConstants } from "../../offers/constants/payment.constants";
import { BeneficiaryService } from "../components/services/beneficiary.service";

@Injectable()
export class PersonalInformationResolver implements Resolve<Array<Beneficiary>>{
    constructor(
        private _pymentValidityResolver: PaymentValidityResolver,
        private _beneficiaryService: BeneficiaryService,
        private _router: Router
    ) { }
    async resolve(route: ActivatedRouteSnapshot): Promise<Array<Beneficiary>> {
        const quoteId = route.params[AppConstants.ROUTE_DATA_KEYS.QUOTE_ID];
        const paymentValidationResult = await this._pymentValidityResolver.resolve(route).toPromise();
        // Paid => resolve beneficiaries and continue
        if (paymentValidationResult.paid) {
            const beneficiaries = await this._beneficiaryService.getBeneficiaries(quoteId).toPromise();
            return beneficiaries;
        }
        // Unpaid => redirect to checkout screen
        this._router.navigate([AppConstants.ROUTES.MAIN, AppConstants.ROUTES.OFFERS, AppConstants.ROUTES.CHECKOUT, quoteId, PaymentConstants.PaymentStatus.PAYMENT_FAILED])
        return null;
    }
}