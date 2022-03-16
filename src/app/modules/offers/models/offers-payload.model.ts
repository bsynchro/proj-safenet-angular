import { DimensionInput } from "./offer-result.model";
import { Offer } from "./offer.model";

export class GetOffersPayload {
    public coverageArea: string;
    public tripDuration: string;
    public sportsActivity: string;
    public age: number;
    public withDeductible: string;
    public type: string;
}

export class RepriceOffersPayload extends GetOffersPayload {
    public offerCode: string;
    public static fromGetOffersPayload(getOffersPayload: GetOffersPayload, offerCode: string = undefined): RepriceOffersPayload {
        const repriceOffersPayload = new this();
        repriceOffersPayload.age = getOffersPayload.age;
        repriceOffersPayload.coverageArea = getOffersPayload.coverageArea;
        repriceOffersPayload.sportsActivity = getOffersPayload.sportsActivity;
        repriceOffersPayload.tripDuration = getOffersPayload.tripDuration;
        repriceOffersPayload.type = getOffersPayload.type;
        repriceOffersPayload.withDeductible = getOffersPayload.withDeductible;
        repriceOffersPayload.offerCode = offerCode;
        return repriceOffersPayload;
    }
}

export class PurchaseOfferPayload {
    public dateOfBirth: Date;
    public offer: Offer;
    public dimensions: Array<DimensionInput>;
    public cumulativeDays: number;
}