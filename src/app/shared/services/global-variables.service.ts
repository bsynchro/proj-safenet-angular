import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '@bsynchro/services';
import { environment } from 'src/environments/environment';
import { AppConstants } from '../constants/app.constants';
import { isNullOrUndefined } from 'util';
import { Observable } from 'rxjs/internal/Observable';
import { GlobalVariable } from '../models/global-variable.model';

@Injectable({
    providedIn: 'root'
})
export class GlobalVariablesService {
    private _variables: Array<GlobalVariable>;

    constructor(private httpClient: HttpClient) {
        this._variables = new Array<GlobalVariable>();
    }

    public getByName(variableName: string): Observable<GlobalVariable> {
        return new Observable<GlobalVariable>((observer) => {
            this.getByNames([variableName]).subscribe((variables) => {
                if (!isNullOrUndefined(variables) && variables.length > 0) {
                    observer.next(variables[0]);
                    observer.complete();
                } else {
                    observer.next(null);
                    observer.complete();
                }
            });
        });
    }

    public getByNames(variableNames: Array<string>): Observable<Array<GlobalVariable>> {
        return new Observable<any>((observer) => {
            let result = new Array<GlobalVariable>();
            const variablesToRequest = new Array<string>();

            variableNames.forEach((variableName) => {
                const targetVariable = this._variables.find((v) => v.name == variableName);
                if (isNullOrUndefined(targetVariable)) {
                    variablesToRequest.push(variableName);
                }
            });

            result = this._variables.filter((variable) => variableNames.includes(variable.name));

            if (variablesToRequest.length == 0) {
                observer.next(result);
                observer.complete();
            } else {
                const api = new ApiService(this.httpClient, environment.GlobalVariables);
                const payload = {
                    Names: variablesToRequest,
                    EntityId: AppConstants.CORA_CONSTANTS.ENTITY_IDS.SAFENET
                };

                api
                    .post(AppConstants.CONTROLLER_NAMES.GLOBAL_VARIABLE, AppConstants.ACTION_NAMES.GET_MANY, payload)
                    .subscribe((variables: any) => {
                        variables.forEach((variable) => {
                            this._variables.push({ name: variable.name, value: variable.value });
                            result.push({ name: variable.name, value: variable.value });
                        });
                        observer.next(result);
                        observer.complete();
                    });
            }
        });
    }
}
