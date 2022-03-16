import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { GlobalVariable } from "src/app/shared/models/global-variable.model";
import { GlobalVariablesService } from "src/app/shared/services/global-variables.service";

export class GlobalVariablesResolver implements Resolve<Array<any>> {

    constructor(private _globalVariablesService: GlobalVariablesService, private variableNames: Array<string>) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Array<GlobalVariable>> {
        return this._globalVariablesService.getByNames(this.variableNames);
    }
}

@Injectable()
export class WizardGlobalVariablesResolver extends GlobalVariablesResolver {
    constructor(_globalVariablesService: GlobalVariablesService) {
        super(_globalVariablesService, AppConstants.WIZARD_GLOBAL_VARIABLES);
    }
}

@Injectable()
export class OffersGlobalVariablesResolver extends GlobalVariablesResolver {
    constructor(_globalVariablesService: GlobalVariablesService) {
        super(_globalVariablesService, AppConstants.OFFERS_GLOBAL_VARIABLES);
    }
}