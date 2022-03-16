import { LocalizedValue } from "@bsynchro/services";

export class Offer {
    public id: string;
    public configurationId: string;
    public title: string;
    public titleTranslation: Array<LocalizedValue>;
    public code: string;
    public productId: number;
    public description: string;
    public currency: string;
    public order: number;
    public tags: string;
    public price: number;
    public detailedPrice: DetailedPrice;
    public benefits: Array<Benefit>;
    public fields: Array<ProjectionField>;
    public iteration: Array<{ [key: string]: any }>;
    public isCashValueCorrected: boolean;
    public initialTargetPremium: number;
    public errors: Array<RatingError>;
    public integrationSets: Array<Array<{ [key: string]: any }>>;
    public reviewRules: Array<ReviewRule>;
    public entityId: number;
}

export class DetailedPrice {
    public members: Array<Member>;
    public policyLevel: Array<PolicyLevel>;
    public totals: Array<TotalVariables>;
}

export class Member {
    public sMIID: string;
    public price: Array<VariablePrice>;
}

export class VariablePrice {
    public name: string;
    public memberId: string;
    public total: number;
    public type: string;
    public isTotal: boolean;
}

export class PolicyLevel {
    public name: string;
    public type: string;
    public isTotal: boolean;
    public total: number;
}

export class TotalVariables {
    public name: string;
    public type: string;
    public isTotal: boolean;
    public total: number;
    public integrationSets: Array<any>;
}

export class Benefit {
    public order: number;
    public title: string;
    public titleTranslation: Array<LocalizedValue>;
    public name: string;
    public code: string;
    public tags: string;
    public description: string;
    public optionalCase: string;
    public optionalRule: string;
    public mandatoryCase: string;
    public mandatoryRule: string;
    public properties: Array<BenefitProperty>;
    public isMandatory: boolean;
    public isOptional: boolean;
    public integrationSets: Array<Array<{ [key: string]: any }>>;
}

export class BenefitProperty {
    public order: number;
    public title: string;
    public titleTranslation: Array<LocalizedValue>;
    public name: string;
    public type: string;
    public code: string;
    public description: string;
    public tags: string;
    public value: any;
    public dataType: number;
    public format: string;
    public currency: string;
    public displayValue: string;
    public displayValueTranslation: Array<LocalizedValue>;
    public optionalCase: string;
    public optionalRule: string;
    public mandatoryCase: string;
    public mandatoryRule: string;
    public isMandatory: boolean;
    public isOptional: boolean;
    public propertyMetaData: PropertyMetaData;
    public integrationSets: Array<Array<{ [key: string]: any }>>;
    public propertyCase: Array<BenefitPropertyCase>;
    public descriptionTranslation: Array<LocalizedValue>;
}

export class PropertyMetaData {
    public dataListId: string;
    public displayName: string;
    public code: string;
    public defaultValue: string;
    public label: string;
}

export class BenefitPropertyCase {
    public rule: string;
    public value: string;
    public displayValue: string;
    public displayValueTranslation: Array<LocalizedValue>;
    public valueType: string;
    public propertyMetaData: PropertyMetaData;
}

export class ProjectionField {
    public name: string;
    public order: number;
    public isTableField: boolean;
    public hasInitialValue: boolean;
    public value: number;
    public iterativeValues: Array<IterativeValue>;
}

export class IterativeValue {
    public iteration: number;
    public value: number;
}

export class RatingError {
    public reason: string;
    public message: string;
}

export class ReviewRule {
    public name: string;
    public rule: string;
    public reason: string;
}