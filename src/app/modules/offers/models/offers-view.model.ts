import { LocalizedValue } from "@bsynchro/services";

export class OffersView {
    numberPerPage: number;
    offers: Array<OfferView>
}

export class OfferView {
    logoUrl: string;
    title: Array<LocalizedValue>;
    checkboxes: Array<{
        title: Array<LocalizedValue>,
        value: Array<LocalizedValue>,
        checked: boolean;
        propertyName: string,
        visible: boolean
    }>;
    code: string;
    premium: number;
    currency: string;
    benefits: Array<BenefitView>;
    highlightedProperties: Array<HighlightedProperty>;
    payload: { [key: string]: any };
    entityId: number;
    showDetails: boolean;
}

export class HighlightedProperty {
    code: string;
    title: Array<LocalizedValue>;
    checked: boolean;
}

export class BenefitView {
    code: string;
    title: Array<LocalizedValue>;
    properties: Array<PropertyView>;
}

export class PropertyView {
    code: string;
    tags: string;
    value: string;
    isOptional: boolean;
    title: Array<LocalizedValue>;
    displayValue: Array<LocalizedValue>;
}

export class UpsellingCover {
    code: string;
    title: Array<LocalizedValue>;
    description: Array<LocalizedValue>;
    checked: boolean;
    propertyName: string;
    value: number;
}