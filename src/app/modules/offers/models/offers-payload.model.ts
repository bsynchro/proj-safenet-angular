import { DimensionInput } from "./offer-result.model";
import { Offer } from "./offer.model";

export class GetOffersPayload {
    public coverageArea: string;
    public sportsActivity: string;
    public age: number;
    public withDeductible: string;
    public type: string;
    public from: Date;
    public to: Date;
}

export class RepriceOffersPayload extends GetOffersPayload {
    public offerCode: string;
    public static fromGetOffersPayload(getOffersPayload: GetOffersPayload, offerCode: string = undefined): RepriceOffersPayload {
        const repriceOffersPayload = new this();
        repriceOffersPayload.age = getOffersPayload.age;
        repriceOffersPayload.coverageArea = getOffersPayload.coverageArea;
        repriceOffersPayload.sportsActivity = getOffersPayload.sportsActivity;
        repriceOffersPayload.type = getOffersPayload.type;
        repriceOffersPayload.withDeductible = getOffersPayload.withDeductible;
        repriceOffersPayload.offerCode = offerCode;
        repriceOffersPayload.from = getOffersPayload.from;
        repriceOffersPayload.to = getOffersPayload.to;
        return repriceOffersPayload;
    }
}

export class PurchaseOfferPayload {
    public dateOfBirth: string;
    public offerCode: string;
    public dimensions: Array<DimensionInput>;
    public from: Date;
    public to: Date;
}