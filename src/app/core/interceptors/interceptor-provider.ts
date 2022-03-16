import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationInterceptor } from './authentication-interceptor';
import { HttpRequestInterceptor } from './http-request.interceptor';

/** Http interceptor providers in outside-in order */
export const INTERCEPTOR_PROVIDER = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
];
