export class ValidationError {
    public code: string;
    public header: string;
    public message: string;
}

export class ValidatePaymentResult {
    public paid: boolean;
    public errors: Array<ValidationError>;
}