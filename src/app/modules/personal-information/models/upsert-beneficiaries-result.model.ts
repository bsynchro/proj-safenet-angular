import { Beneficiary } from "src/app/shared/models/crm.model";

export class UpsertBeneficiariesResult {
    public contactId: string;
    public id: string; // quote id
    public beneficiaries: Array<Beneficiary>;
}