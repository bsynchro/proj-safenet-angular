import { RepriceOffersPayload } from "./offers-payload.model";

export class CheckoutPayload extends RepriceOffersPayload {
    public quoteId: string;
    public couponCodes: Array<string>;
}