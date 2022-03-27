import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from "@bsynchro/services";
import { Observable } from "rxjs/internal/Observable";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { Beneficiary } from "src/app/shared/models/crm.model";
import { environment } from "src/environments/environment";
import { UpsertBeneficiariesResult } from "../models/upsert-beneficiaries-result.model";

@Injectable()
export class BeneficiaryService {
    //#region ctor
    constructor(private _httpClient: HttpClient) { }
    //#endregion

    //#region public methods
    public getBeneficiaries(quoteId: string): Observable<Array<Beneficiary>> {
        return new Observable<Array<Beneficiary>>((observer) => {
            const api = new ApiService(this._httpClient, environment.CRM);
            api.get(AppConstants.CONTROLLER_NAMES.BENEFICIARIES, quoteId).subscribe((res: any) => {
                if (res && res.beneficiaries) {
                    observer.next(res.benefits as Array<Beneficiary>)
                    observer.complete();
                }
                else {
                    observer.next(null);
                    observer.complete();
                }
            });
        });
    }

    public upsertBeneficiaries(quoteId: string, beneficiaries: Array<Beneficiary>): Observable<UpsertBeneficiariesResult> {
        return new Observable<UpsertBeneficiariesResult>((observer) => {
            const payload = this.getUpsertBeneficiariesPayload(quoteId, beneficiaries);
            const api = new ApiService(this._httpClient, environment.CRM);
            api.post(AppConstants.CONTROLLER_NAMES.BENEFICIARIES, AppConstants.ACTION_NAMES.UPSERT, payload).subscribe((res: any) => {
                const result = res as UpsertBeneficiariesResult;
                observer.next(result)
                observer.complete();
            });
        });
    }
    //#endregion

    //#region private methods
    private getUpsertBeneficiariesPayload(quoteId: string, beneficiaries: Array<Beneficiary>) {
        return {
            quoteId,
            beneficiaries
        };
    }
    //#endregion
}