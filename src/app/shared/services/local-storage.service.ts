import { Injectable } from "@angular/core";
import { isNullOrUndefined, isUndefined } from "util";
import { AppConstants } from "../constants/app.constants";
import { LocalStorageItem } from "../models/local-storage-item.model";
import { UtilsService } from "./utils.service";

@Injectable()
export class LocalStorageService {
    //#region Public
    public static getFromLocalStorage<T>(key: string, userId?: string, deleteIfExpired: boolean = true): T {
        if (localStorage) {
            // Add userId to key if passed
            if (userId) {
                key = `${key}-${userId}`;
            }
            const serializedItem = localStorage.getItem(key);
            if (!isNullOrUndefined(serializedItem)) {
                const localStorageItem: LocalStorageItem<T> = JSON.parse(serializedItem);
                // If item is expired, delete from local storage and exit
                if (deleteIfExpired && localStorageItem.expirationDate && UtilsService.isDateExpired(new Date(localStorageItem.expirationDate))) {
                    LocalStorageService.deleteFromLocalStorage(key);
                    return null;
                }
                return localStorageItem.data;
            }
        }
    }

    /**
     * Serializes and saves item in local storage with expiration date.
     * @param key Item to be saved key
     * @param item Item to be saved
     * @param ttl Time To Live in minutes
     */
    public static setInLocalStorage<T>(key: string, item: T, ttl?: number, userId?: string) {
        if (localStorage && !isUndefined(item)) {
            const localStorageItem = new LocalStorageItem<T>();
            localStorageItem.data = item;
            // Set expiration date if ttl is passed
            if (ttl) {
                localStorageItem.expirationDate = UtilsService.addMinutes(new Date(), ttl);
            }
            const serializedItem = JSON.stringify(localStorageItem);
            // Add userId to key if passed
            if (userId) {
                key = `${key}-${userId}`;
            }
            localStorage.setItem(key, serializedItem);
        }
    }

    public static deleteFromLocalStorage(key: string, userId?: string) {
        if (localStorage) {
            // Add userId to key if passed
            if (userId) {
                key = `${key}-${userId}`;
            }
            localStorage.removeItem(key);
        }
    }

    //#region Language
    public static getLanguageFromLocalStorage(userId: string): string {
        return LocalStorageService.getFromLocalStorage(AppConstants.LOCAL_STORAGE.LANGUAGE, userId);
    }

    public static setLanguageInLocalStorage(userId: string, language: string) {
        LocalStorageService.setInLocalStorage(AppConstants.LOCAL_STORAGE.LANGUAGE, language, null, userId);
    }
    //#endregion
    //#endregion
}