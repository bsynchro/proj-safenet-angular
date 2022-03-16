import { Injectable } from "@angular/core";
import { CanLoad } from "@angular/router";
import { AuthenticationService } from "@bsynchro/services";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
    providedIn: 'root'
})

export class AuthGuardService implements CanLoad {
    constructor(private _authService: AuthenticationService) {
    }

    public canLoad(): Observable<boolean> {
        return new Observable<boolean>(observer => {
            this._authService.getUserFromLocalStorage().subscribe(user => {
                if (this._authService.isLoggedIn() && !user.expired) {
                    observer.next(true);
                    observer.complete();
                } else if (this._authService.isLoggedIn() && user.expired) {
                    console.log('expired user');
                    this._authService.endAuthentication();
                    observer.next(false);
                    observer.complete();
                } else {
                    observer.next(true);
                    observer.complete();
                }
            });
        });
    }
}