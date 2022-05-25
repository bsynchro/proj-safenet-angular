import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from "@bsynchro/services";
import { Observable } from "rxjs/internal/Observable";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { environment } from "src/environments/environment";
import { IssuePolicyResult } from "../models/issue-policy-result.model";

@Injectable()
export class PolicyService {
    constructor(private _httpClient: HttpClient) { }

    //#region public methods
    public issuePolicy(quoteId: string): Observable<IssuePolicyResult> {
        return new Observable<IssuePolicyResult>((observer) => {
            const api = new ApiService(this._httpClient, environment.CRM);
            api.get(AppConstants.CONTROLLER_NAMES.POLICY, `${AppConstants.ACTION_NAMES.ISSUE}/${quoteId}`).subscribe((res: any) => {
                if (res) {
                    observer.next(res as IssuePolicyResult)
                    observer.complete();
                }
                else {
                    observer.next(null);
                    observer.complete();
                }
            });
        });
    }
    //#endregion
}