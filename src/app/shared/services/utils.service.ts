import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "@bsynchro/services";

@Injectable()
export class UtilsService {
    //#region Authorization
    public static getSub(authService: AuthenticationService): string {
        if (authService.isLoggedIn() && authService.oidcUser && authService.oidcUser.profile && authService.oidcUser.profile.sub) {
            return authService.oidcUser.profile.sub;
        }
        return 'guest';
    }
    //#endregion

    //#region Design
    public static get isMobile(): boolean {
        if (window.matchMedia("(min-width: 1024px)").matches) {
            return false;
            /* the viewport is at least 400 pixels wide */
        } else {
            return true;
            /* the viewport is less than 400 pixels wide */
        }
    }
    //#endregion

    //#region Date
    public static getFormattedDateInstance(date, format) {
        if (!!date) {
            let datePipe = new DatePipe('en-US'); // !TODO translation 
            return datePipe.transform(date, format);
        }
        return null;
    }

    public static addMinutes(date: Date, minutes: number): Date {
        return new Date(date.getTime() + (minutes * 60000));
    }

    public static isDateExpired(date: Date): boolean {
        if (!date) {
            return false;
        }
        return date.getTime() <= new Date().getTime();
    }

    public static getAge(dob: Date) {
        if (dob) {
            let timeDiff = Math.abs(Date.now() - dob.getTime());
            return Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        }
    }

    public static getDateDiffernnceInDays(from: Date, to: Date): number {
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        // Discard the time and time-zone information.
        const d1 = new Date(from.getFullYear(), from.getMonth(), from.getDate()) as any;
        const d2 = new Date(to.getFullYear(), to.getMonth(), to.getDate()) as any;
        return Math.ceil((d2 - d1 + 1) / _MS_PER_DAY);
    }
    //#endregion
}