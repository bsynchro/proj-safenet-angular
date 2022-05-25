import { PurchaseOfferResult } from "./purchase-offer-result.model";

export class CheckoutResolvedData {
    public purchaseOfferResult: PurchaseOfferResult;
    public paymentFailed: boolean;
    public errorCodes: Array<string>;
}