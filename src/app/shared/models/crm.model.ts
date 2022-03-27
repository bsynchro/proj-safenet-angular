import { DataListField } from "@bsynchro/services";
import { PhoneType } from "../enums/crm.enums";

export class Quote {
    [key: string]: any;
}

export class Contact {
    [key: string]: any;
}

export class Beneficiary {
    public id: string;
    public firstName: string;
    public lastName: string;
    public dateOfBirth: string;
    public passportNumber: string;
    public gender: DataListField;
    public relation: DataListField;
    public mobileNumber: PhoneNumber;
    public countryOfResidence: DataListField;
}

export class PhoneNumber {
    public number: string;
    public phoneType: PhoneType;
    public extension: string;
}