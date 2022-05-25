export class OffersConstants {
    public static WITH_DEDUCIBLE = class {
        public static CODES = class {
            public static readonly YES = 'yes';
            public static readonly NO = 'no';
        }
        public static readonly PROPERTY_NAME = "withDeductible";
    }

    public static SPORTS_ACTIVITY = class {
        public static CODES = class {
            public static readonly YES = 'yes';
            public static readonly NO = 'no';
        }
        public static readonly PROPERTY_NAME = "sportsActivity";
    }

    public static OFFER_PAYLOAD_PROPERTIES = class {
        public static CODES = class {
            public static readonly YES = 'yes';
            public static readonly NO = 'no';
        }
    }

    public static TAGS = class {
        public static BENEFIT = class {
            public static readonly HIGHLIGHT = 'Highlight';
        }
        public static BENEFIT_PROPERTY = class {
            public static readonly OFFER_LIST_ITEM_HEADER = 'OfferListItemHeader';
            public static readonly UPSELLING = 'UpSelling';
        }
    }

    public static DIMENSION = class {
        public static NAMES = class {
            public static readonly SMI = 'SMI';
            public static readonly CONTRACT = 'Contract';
        }
    }

    public static SEPERATORS = class {
        public static readonly TAGS = ', ';
    }
}