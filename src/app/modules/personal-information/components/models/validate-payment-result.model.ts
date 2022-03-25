import { ValidationError } from "src/app/shared/models/common.model";

export class ValidatePaymentResult {
    public paid: boolean;
    public errors: Array<ValidationError>;
}