import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utils, IdentityService } from '@bsynchro/services';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserService {
    //#region public fields
    public fileServerUrl: string;
    //#endregion

    //#region Private fields
    private _userImageUrl: string;
    private _userImageLoaded: boolean;
    private _userImagId: string;
    //#endregion

    //#region Public properties
    public get requiredErrorTitle() {
        return 'This field is required!';
    }

    public get claims() {
        return this._identityService.claims;
    }

    public get userImageUrl(): string {
        return this._userImageUrl;
    }

    public get userImageId(): string {
        return this._userImagId;
    }

    public get userImageLoaded(): boolean {
        return this._userImageLoaded;
    }

    public get loggedInUser(): Observable<any> {
        return this._identityService.getUser();
    }
    //#endregion

    constructor(public httpClient: HttpClient, private _identityService: IdentityService) {
        // this.fileServerUrl = environment.FileServer + '/api/' + AppConstants.CONTROLLER_NAMES.FILE;
        this.setUserImage().subscribe();
    }

    //#region user image methods
    private updateUserImage(imageId: string): Observable<any> {
        return new Observable<any>((observer) => {
            this._identityService.updateUserProperty('imageUrl', imageId).subscribe((response) => {
                this.setUserImage().subscribe(() => {
                    observer.next();
                });
            });
        });
    }

    public setUserImage(): Observable<string> {
        return new Observable<string>((observer) => {
            this._identityService.getUser().subscribe((up) => {
                this._userImageLoaded = true;
                const pictureProperty = up.properties.find((p) => p.name === 'imageUrl');
                let imageId = '';
                if (pictureProperty) {
                    imageId = pictureProperty.value;
                }

                if (Utils.isEmpty(imageId)) {
                    this._userImageUrl = '';
                    this._userImagId = '';
                } else {
                    this._userImageUrl = this.fileServerUrl + '/' + imageId;
                    this._userImagId = imageId;
                }
                observer.next();
            });
        });
    }

    public updateImage(imageId: string) {
        return this.updateUserImage(imageId);
    }

    //#endregion

    //#region Actions
    public getUniversalPrincipalById(): Observable<any> {
        return new Observable<any>((observer) => {
            this._identityService.getUser().subscribe((response) => {
                observer.next(response);
            });
        });
    }

    public changePassword(currentPassword: string, newPassword: string, passwordConfirmation: string): Observable<any> {
        return new Observable<any>((observer) => {
            this._identityService
                .changePassword(this.claims.sub, currentPassword, newPassword, passwordConfirmation)
                .subscribe((response) => {
                    observer.next(response);
                });
        });
    }

    //#endregion
}
