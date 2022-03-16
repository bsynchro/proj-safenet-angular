import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { AuthenticationService } from "@bsynchro/services";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
    providedIn: 'root'
})
export class RouteGuardService implements CanActivate {
    constructor(private _authService: AuthenticationService, private _router: Router) {
    }

    public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return new Observable<boolean>(observer => {
            if (this._authService.isLoggedIn()) {
                observer.next(true);
            } else {
                this._authService.startAuthentication();
                observer.next(false);
            }
            observer.complete();
        });
    }
}
