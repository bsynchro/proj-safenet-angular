import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { DataListService } from '@bsynchro/services';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { mergeMap } from 'rxjs/operators';
import { AppConstants } from 'src/app/shared/constants/app.constants';

export class DatalistResolver implements Resolve<Array<any>> {
    constructor(private _datalistService: DataListService, private datalist: string[]) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Array<any>> | Promise<Array<any>> | Array<any> {
        return this._datalistService.getDataListsByName(this.datalist, false, AppConstants.CORA_CONSTANTS.ENTITY_IDS.SAFENET).pipe(
            mergeMap((datalist) => {
                if (datalist) {
                    return of(datalist);
                } else {
                    return of(new Array<any>());
                }
            })
        );
    }
}

@Injectable()
export class WizardDatalistResolver extends DatalistResolver {
    constructor(_datalistService: DataListService) {
        super(_datalistService, AppConstants.WIZARD_DATA_LISTS);
    }
}

@Injectable()
export class OffersDatalistResolver extends DatalistResolver {
    constructor(_datalistService: DataListService) {
        super(_datalistService, AppConstants.OFFERS_DATA_LISTS);
    }
}

@Injectable()
export class PersonalInformationDatalistResolver extends DatalistResolver {
    constructor(_datalistService: DataListService) {
        super(_datalistService, AppConstants.PERSONALINFORMATION_DATA_LISTS);
    }
}