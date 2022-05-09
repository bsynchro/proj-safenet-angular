import { Injectable } from "@angular/core";
import { CanLoad } from "@angular/router";
import { AuthenticationService } from "@bsynchro/services";
import { Observable } from "rxjs/internal/Observable";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";

@Injectable({
    providedIn: 'root'
})

export class AuthGuardService implements CanLoad {
    constructor(private _authService: AuthenticationService) {
    }

    public canLoad(): Observable<boolean> {
        return new Observable<boolean>(observer => {
            this._authService.getUserFromLocalStorage().subscribe(user => {
                // logged in
                if (this._authService.isLoggedIn() && !user.expired) {
                    observer.next(true);
                    observer.complete();
                }
                // logged in but expired
                else if (this._authService.isLoggedIn() && user.expired) {
                    console.log('expired user');
                    this._authService.endAuthentication();
                    observer.next(false);
                    observer.complete();
                }
                // Not logged in
                else {
                    // Should redirect to login
                    const shouldLogin = LocalStorageService.getFromLocalStorage<boolean>(AppConstants.LOCAL_STORAGE.SHOULD_LOGIN);
                    if (shouldLogin) {
                        LocalStorageService.deleteFromLocalStorage(AppConstants.LOCAL_STORAGE.SHOULD_LOGIN);
                        this._authService.startAuthentication();
                        observer.next(false);
                        observer.complete();
                    }
                    // Continue normally
                    else {
                        observer.next(true);
                        observer.complete();
                    }
                }
            });
        });
    }
}