import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { delay } from 'rxjs/internal/operators/delay';

@Injectable({ providedIn: 'root' })
export class LoaderService {
    //#region properties
    // This is a behavior subject for listening to the value of the spinner loading state. true will show the spinner, false will hide the spinner.
    private _loadingSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    // Contains in-progress loading requests
    private _loadingMap: Map<string, boolean> = new Map<string, boolean>();
    private _activeManualRequests = 0;
    private _isManualLoaderVisible = false;
    private _isLoaderVisible = false;
    //#endregion

    //#region getters
    public get isLoaderVisible(): boolean {
        return this._isLoaderVisible || this._isManualLoaderVisible;
    }
    //#endregion

    //#region ctor
    constructor() {
        this._loadingSub
            .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
            .subscribe((loading) => {
                this._isLoaderVisible = loading;
            });
    }
    //#endregion

    //#region public methods
    /**
   * Sets the loadingSub property value based on the following:
   * - If loading is true, add the provided url to the loadingMap with a true value, set loadingSub value to true
   * - If loading is false, remove the loadingMap entry and only when the map is empty will we set loadingSub to false
   * This pattern ensures if there are multiple requests awaiting completion, we don't set loading to false before
   * other requests have completed. At the moment, this function is only called from the @link{HttpRequestInterceptor}
   * @param loading {boolean}
   * @param url {string}
   */
    public setLoading(loading: boolean, url: string): void {
        if (!url) {
            throw new Error('The request URL must be provided to the loader setLoading function');
        }
        if (loading === true) {
            this._loadingMap.set(url, loading);
            this._loadingSub.next(true);
        } else if (loading === false && this._loadingMap.has(url)) {
            this._loadingMap.delete(url);
        }
        if (this._loadingMap.size === 0) {
            this._loadingSub.next(false);
        }
    }

    public showManualLoader() {
        this._activeManualRequests++;
        this._isManualLoaderVisible = true;
    }
    public hideManualLoader() {
        this._activeManualRequests--;
        if (this._activeManualRequests === 0) {
            this._isManualLoaderVisible = false;
        }
    }
    //#endregion
}
