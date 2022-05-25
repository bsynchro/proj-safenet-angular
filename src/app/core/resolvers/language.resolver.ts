import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { DataListService, IdentityService, UITranslateService } from "@bsynchro/services";
import { Observable } from "rxjs/internal/Observable";
import { combineLatest } from "rxjs/internal/observable/combineLatest";
import { of } from "rxjs/internal/observable/of";
import { mergeMap } from "rxjs/internal/operators/mergeMap";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";
import { environment } from "src/environments/environment";

@Injectable()
export class LanguageResolver implements Resolve<void> {

    //#region fields
    private _userPreferredLanguage: { id: string, preferredLanguage: string };
    //#endregion fields

    //#region ctor
    constructor(
        private _datalistService: DataListService,
        private _translateService: UITranslateService,
        private _identityService: IdentityService
    ) { }
    //#endregion ctor

    //#region implementation
    resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
        return new Observable((observer) => {
            // Prepare language datalists
            const dataListObservables = [];
            AppConstants.HOME_DATA_LISTS.forEach((datalist) => {
                dataListObservables.push(
                    this._datalistService.getDataListsByName([datalist.name], datalist.isSystem, AppConstants.CORA_CONSTANTS.ENTITY_IDS.SAFENET, AppConstants.LCIDS.ENGLISH).pipe(
                        mergeMap((localizedDatalists) => {
                            if (localizedDatalists) {
                                const flattenedDataLists = localizedDatalists.reduce(
                                    (acc, val) => acc.concat(val.dataLists), []
                                );
                                return of(flattenedDataLists);
                            } else {
                                return of(new Array<any>());
                            }
                        })
                    )
                );
            });
            // Try to get logged in user
            this._identityService.getUser().subscribe((user) => {
                // Set user id and preferred language
                this._userPreferredLanguage = {
                    id: user ? this._identityService.claims.sub : AppConstants.LOCAL_STORAGE.GUEST_ID,
                    preferredLanguage: user ? user.preferredLanguage : null
                }
                // Get datalists
                combineLatest(dataListObservables).pipe(
                    mergeMap((arr: Array<Array<Array<any>>>) => {
                        return of(
                            arr.reduce(
                                (acc, val) => acc.concat(val), []
                            )
                        )
                    })
                ).subscribe((dataLists => {
                    // Initialize translations and set language
                    this.initializeTranslation(dataLists);
                    observer.next();
                    observer.complete()
                }));
            });
        });
    }
    //#endregion implementation

    //#region private methods
    private initializeTranslation(dataLists: any[][]) {
        if (!this._translateService.currentLcid) {
            this._translateService.currentLcid = environment.defaultLcid;
        }
        const languages = dataLists.find(d => d[0].dataListName === AppConstants.SYSTEM_DATA_LIST_NAMES.LANGUAGES);
        const preferredLanguages = dataLists.find(d => d[0].dataListName === AppConstants.DATA_LIST_NAMES.PREFERRED_LANGUAGE);
        // Set languages
        this._translateService.languages = languages.filter(l => preferredLanguages.find(pl => l.name === pl.code));
        this.setDefaultLanguage();
    }

    private setDefaultLanguage() {
        const storedLanguage = LocalStorageService.getLanguageFromLocalStorage(this._userPreferredLanguage.id);
        const userDefaultLanguage = this._userPreferredLanguage.preferredLanguage;
        const defaultLanguage = storedLanguage ? storedLanguage // Try to get lang from localstorage
            : userDefaultLanguage ? userDefaultLanguage // Try to get user default lang
                : AppConstants.LANGUAGE_CODES.ENGLISH; // English
        // Set default language
        this._translateService.setDefaultLanguage(defaultLanguage);
        LocalStorageService.setLanguageInLocalStorage(this._userPreferredLanguage.id, defaultLanguage);
    }
    //#endregion private methods
}