export class AppWizardConstants {
    public static SECTION_NAMES = class {
        public static readonly TRAVEL_DESTINATION = 'travel-destination';
        public static readonly TRAVEL_DURATION = 'travel-duration';
        public static readonly DOB = 'date-of-birth';
        public static readonly TRAVEL_TYPE = 'travel-type';
    }

    public static USER_INFO_PROPERTIES = class {
        public static readonly COVERAGE_AREA = 'coverageArea';
        public static readonly TRIP_DURATION = 'tripDuration';
        public static readonly DOB = 'dob';
        public static readonly TYPE = 'type';
    }

    public static TRAVEL_TYPES = class {
        public static CODES = class {
            public static readonly INDIVIDUAL = 'Individual';
            public static readonly FAMILY = 'Family';
        };
        public static TRANSLATION_KEYS = class {
            public static readonly INDIVIDUAL = 'individual';
            public static readonly FAMILY = 'family';
        }
    }
}