import { Offer } from "./offer.model";

export class OfferResult {
    public offers: Array<Offer>;
    public dimensions: Array<DimensionInput>;
}

export class DimensionInput {
    public name: string;
    public policyLevel: { [key: string]: any };
    public members: Array<{ [key: string]: any }>;
    public properties: { [key: string]: any };
}