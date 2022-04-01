import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { IssuePolicyResult } from "../models/issue-policy-result.model";
import { PolicyService } from "../services/policy.service";

@Injectable()
export class PolicyResolver implements Resolve<IssuePolicyResult>{
    constructor(
        private _policyService: PolicyService
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<IssuePolicyResult> {
        return new Observable<IssuePolicyResult>((observer) => {
            const quoteId = route.params[AppConstants.ROUTE_DATA_KEYS.QUOTE_ID];
            this._policyService.issuePolicy(quoteId).subscribe((res) => {
                const result = res as IssuePolicyResult;
                observer.next(result);
                observer.complete();
            });
        });
    }
}