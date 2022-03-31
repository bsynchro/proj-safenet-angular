import { Beneficiary } from "src/app/shared/models/crm.model";

export class GetBeneficiariesResult {
    public beneficiaries: Array<Beneficiary>;
    public additionalData: { [key: string]: any }
}