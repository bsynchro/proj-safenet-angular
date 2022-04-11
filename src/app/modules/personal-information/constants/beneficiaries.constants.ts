export class BeneficiariesConstants {
    public static Relation = class {
        public static readonly PRINCIPAL = 'Principal';
        public static readonly SPOUSE = 'Spouse';
        public static readonly CHILD = 'Child';
    }

    public static Properties = class {
        public static readonly ID = 'id';
        public static readonly FIRST_NAME = 'firstName';
        public static readonly LAST_NAME = 'lastName';
        public static readonly COUNTRY_OF_RESIDENCE = 'countryOfResidence';
        public static readonly PASSPORT_NUMBNER = 'passportNumber';
        public static readonly GENDER = 'gender';
        public static readonly MOBILE_NUMBER = 'mobileNumber';
        public static readonly DESTINATION_COUNTRY = 'destinationCountry';
        public static readonly DATE_OF_BIRTH = 'dateOfBirth';
        public static readonly RELATION = 'relation';
        public static readonly MARITAL_STATUS = 'maritalStatus';
        public static readonly EMAIL = 'email';
    }

    public static NumberOfBeneficiariesLimit = class {
        public static readonly SPOUSE = 1;
        public static readonly CHILD = 6;
    }
}