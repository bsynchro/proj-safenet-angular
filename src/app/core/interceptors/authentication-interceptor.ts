import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '@bsynchro/services';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    constructor(private _authService: AuthenticationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this._authService.isLoggedIn()) {
            const authReq = req.clone({
                setHeaders: {
                    Authorization:
                        this._authService.oidcUser.token_type +
                        ' ' +
                        this._authService.oidcUser.access_token
                }
            });
            return next.handle(authReq);
        }
        else {
            return next.handle(req);
        }
    }

}
