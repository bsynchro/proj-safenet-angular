import { UserManagerSettings, WebStorageStateStore } from "oidc-client";
import { environment } from "src/environments/environment";

export class AppConstants {
    //#region DataList
    public static DATA_LIST_NAMES = class {
        public static readonly PREFERRED_LANGUAGE = 'PreferredLanguage';
        public static readonly GEOGRAPHICAL_COVERAGE = 'TGeographicalCoverage';
        public static readonly DURATION = 'TDuration';
        public static readonly IC_GENERAL_INFO = 'ICGeneralInfo';
        public static readonly COUNTRY = 'TCountry';
        public static readonly GENDER = 'Gender';
    };

    public static SYSTEM_DATA_LIST_NAMES = class {
        public static readonly LANGUAGES = 'Languages';
    };

    public static HOME_DATA_LISTS = [
        { name: AppConstants.DATA_LIST_NAMES.PREFERRED_LANGUAGE, isSystem: false },
        { name: AppConstants.SYSTEM_DATA_LIST_NAMES.LANGUAGES, isSystem: true }
    ];

    public static WIZARD_DATA_LISTS = [
        AppConstants.DATA_LIST_NAMES.GEOGRAPHICAL_COVERAGE,
        AppConstants.DATA_LIST_NAMES.DURATION
    ];

    public static OFFERS_DATA_LISTS = [
        AppConstants.DATA_LIST_NAMES.GEOGRAPHICAL_COVERAGE,
        AppConstants.DATA_LIST_NAMES.DURATION,
        AppConstants.DATA_LIST_NAMES.IC_GENERAL_INFO
    ]

    public static CHECKOUT_DATA_LISTS = [
        AppConstants.DATA_LIST_NAMES.GEOGRAPHICAL_COVERAGE,
        AppConstants.DATA_LIST_NAMES.IC_GENERAL_INFO
    ]

    public static PERSONALINFORMATION_DATA_LISTS = [
        AppConstants.DATA_LIST_NAMES.COUNTRY,
        AppConstants.DATA_LIST_NAMES.GENDER
    ]
    //#endregion

    //#region DataList Codes
    public static DATA_LIST_CODES = class {
        public static GENDER = class {
            public static readonly MALE = 'Male';
            public static readonly FEMALE = 'Female';
        }
    }
    //#endregion

    //#region Languages
    public static LANGUAGE_CODES = class {
        public static readonly ENGLISH = "en-us";
        public static readonly ARABIC = "ar-lb";
    };

    public static LCIDS = class {
        public static readonly ENGLISH = 1033;
        public static readonly ARABIC = 12289;
    };
    //#endregion

    //#region Cora
    static CORA_CONSTANTS = class {
        public static ENTITY_IDS = class {
            public static readonly SAFENET = 120;
        }
    }
    //#endregion

    //#region Local Storage
    public static LOCAL_STORAGE = class {
        public static readonly LANGUAGE = 'language';
        public static readonly USER_INFO = 'userInfo';
        public static readonly GUEST_ID = 'guest';
        public static readonly DEFAULT_TTL = 60;
        public static readonly PURCHASE_OFFER_PAYLOAD = "PurchaseOfferPayload";
        public static readonly PURCHASE_OFFER_RESULT = "PurchaseOfferResult";
    }
    //#endregion

    //#region Routes
    public static ROUTES = class {
        public static readonly MAIN = 'main';
        public static readonly OFFERS = 'offers';
        public static readonly CALLBACK = 'callback';
        public static readonly REFRESH = 'refresh';
        public static readonly CHECKOUT = 'checkout';
        public static readonly PERSONALINFORMATION = 'personalInformation';
        public static readonly POLICY = 'policy';
    }

    public static ROUTE_DATA_KEYS = class {
        public static readonly EDIT_MODE = 'editMode';
        public static readonly PAYMENT_FLAG = 'paymentFlag';
        public static readonly PAYMENT_ERROR_CODE = 'paymentErrorCode';
        public static readonly QUOTE_ID = 'quoteId';
    }
    //#endregion

    //#region authentication
    public static OIDC_CLIENT: UserManagerSettings = {
        authority: environment.IdentityServer,
        client_id: 'safenet.portal',
        redirect_uri: environment.Portal + '/callback',
        response_type: 'id_token token',
        scope: 'openid profile ms.identity ms.authorization',
        post_logout_redirect_uri: environment.Portal,
        automaticSilentRenew: true,
        silent_redirect_uri: environment.Portal + '/refresh',
        // includeIdTokenInSilentRenew: true,
        userStore: new WebStorageStateStore({ store: window.sessionStorage }),
        // prompt: 'none',
        loadUserInfo: true,
        filterProtocolClaims: true
        // extraQueryParams: {}
    };
    //#endregion

    //#region APIs
    public static CONTROLLER_NAMES = class {
        public static readonly GLOBAL_VARIABLE = 'GlobalVariable';
        public static readonly OFFERS = 'Offers';
        public static readonly PAYMENT = 'Payment';
        public static readonly BENEFICIARIES = 'Beneficiaries';
        //#endregion
    };

    public static ACTION_NAMES = class {
        //#region Common
        public static readonly GET = 'Get';
        public static readonly GET_MANY = 'GetMany';
        public static readonly POST = 'Post';
        public static readonly SEARCH = 'Search';
        public static readonly UPSERT = 'Upsert';
        //#endregion

        //#region Offers
        public static readonly GET_OFFERS = 'GetOffers';
        public static readonly REPRICE_OFFER = 'RepriceOffer';
        public static readonly PURCHASE_OFFER = 'PurchaseOffer';
        //#endregion

        //#region Payment
        public static readonly CHECKOUT = 'Checkout';
        public static readonly VALIDATE = 'Validate';
        //#endregion
    };
    //#endregion

    //#region GlobalVariables
    public static GLOBAL_VARIABLE_NAMES = class {
        public static readonly MAX_TRAVELER_AGE = 'MaxTravelerAge';
        public static readonly OFFERS_ROWS_PER_PAGE = 'OffersRowsPerPage ';
    }

    public static WIZARD_GLOBAL_VARIABLES = [
        AppConstants.GLOBAL_VARIABLE_NAMES.MAX_TRAVELER_AGE
    ];

    public static OFFERS_GLOBAL_VARIABLES = [
        AppConstants.GLOBAL_VARIABLE_NAMES.OFFERS_ROWS_PER_PAGE
    ];
    //#endregion

    //#region Calendar
    public static CALENDAR = class {
        public static readonly DATE_FORMAT = 'dd/mm/yy';// PRIME-NG CALENDAR COMPONENT COMPATIBLE EQUIVALENT TO dd/mm/yyyy
        public static readonly PLACEHOLDER = 'dd/mm/yyyy';
    }
}