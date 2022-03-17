import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalizedValue, UITranslateService } from '@bsynchro/services';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppWizardConstants } from 'src/app/modules/wizard/constants/wizard.constants';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Translations } from 'src/app/shared/services/translation.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { isNull, isNullOrUndefined } from 'util';
import { OffersConstants } from '../../constants/offers.constants';
import { DimensionInput, OfferResult } from '../../models/offer-result.model';
import { Benefit, BenefitProperty, Offer } from '../../models/offer.model';
import { PurchaseOfferPayload } from '../../models/offers-payload.model';
import { BenefitView, HighlightedProperty, OffersView, OfferView, PropertyView } from '../../models/offers-view.model';
import { OffersService } from '../../services/offers.service';

@Component({
  selector: 'app-offers-list',
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OffersListComponent implements OnInit {
  //#region fields
  private _offersRowsPerPage: number = 10;
  private _offers: Array<Offer> = [];
  private _offerViews: OffersView;
  private _offersDimensions: Array<DimensionInput>;
  private _userInfo: any;
  private _age: string = '';
  private _coverageArea: string = '';
  private _tripDuration: string = '';
  private _travelTypeKey: string = '';
  private _sortDirection: string = 'asc';
  private _languageSubscription: Subscription = new Subscription();
  //#endregion

  //#region getters
  public get offerViews(): OffersView {
    return this._offerViews;
  }

  public get isMobile(): boolean {
    return UtilsService.isMobile;
  }

  public get age(): string {
    return this._age;
  }

  public get coverageArea(): string {
    return this._coverageArea;
  }

  public get tripDuration(): string {
    return this._tripDuration;
  }

  public get travelTypeKey(): string {
    return this._travelTypeKey;
  }

  public get offersRowsPerPage(): number {
    return this._offersRowsPerPage;
  }

  public get isRtl(): boolean {
    return this._translateService.direction == 'rtl'
  }

  public get sortIcon(): string {
    return `../../../../../assets/images/icons/sort-${this._sortDirection == 'desc' ? 'desc' : 'asc'}.svg`;
  }
  //#endregion

  //#region setters
  //#endregion

  //#region ctor
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _offersService: OffersService,
    private _translateService: UITranslateService,
    public translations: Translations
  ) {
  }
  //#endregion

  //#region lifecycle hooks
  ngOnInit() {
    this.setUserInfo();
    this.loadDataLists();
    this.setTravelType();
    this.loadGlobalVariables();
    this.setAge();
    this.initOffers();
    this.sortOffers('premium', 'desc');
  }
  //#endregion

  //#region public methods
  public refineSelection() {
    const routData = {};
    routData[AppConstants.ROUTE_DATA_KEYS.EDIT_MODE] = true;
    this._router.navigate([AppConstants.ROUTES.MAIN, routData]);
  }

  public sortOffers(proertyName: string, sortDirection: string = null) {
    if (this._offerViews && this._offerViews.offers && this._offerViews.offers.length) {
      if (sortDirection) {
        this._sortDirection = sortDirection;
      }
      this._sortDirection = this._sortDirection == 'asc' ? 'desc' : 'asc';
      this._offerViews.offers.sort((a, b) => this._sortDirection == 'asc' ? a[proertyName] - b[proertyName] : b[proertyName] - a[proertyName]);
    }
  }

  public getLocalizedValue(translations: Array<LocalizedValue>) {
    return this._translateService.getTranslationFromArray(translations);
  }

  public async onCheckboxCheck(checked: boolean, offerCode: string, propertyName: string) {
    // Get user info with updated checkbox value
    const userInfo = Object.assign({}, this._userInfo);
    userInfo[propertyName] = checked ?
      OffersConstants.OFFER_PAYLOAD_PROPERTIES.CODES.YES :
      OffersConstants.OFFER_PAYLOAD_PROPERTIES.CODES.NO;
    // Reprice
    await this.repriceOffer(offerCode, userInfo)
  }

  public purchase(offerCode: string) {
    const offer = this._offers.find(o => o.code == offerCode);
    const dimensions = this._offersDimensions;
    const purchaseOfferPayload = new PurchaseOfferPayload();
    purchaseOfferPayload.offer = offer;
    purchaseOfferPayload.dimensions = dimensions;
    LocalStorageService.setInLocalStorage(AppConstants.LOCAL_STORAGE.PURCHASE_OFFER_PAYLOAD, purchaseOfferPayload);
    this._router.navigate([AppConstants.ROUTES.MAIN, AppConstants.ROUTES.OFFERS, AppConstants.ROUTES.CHECKOUT])
  }
  //#endregion

  //#region helpers
  private loadDataLists() {
    this._languageSubscription.unsubscribe();
    this._languageSubscription = this._translateService.onLanguageChange.subscribe(res => {
      const routeResolversData = this._activatedRoute.snapshot.data;
      if (routeResolversData) {
        const datalists = this._translateService.getLocalizedDataLists(routeResolversData.dataLists);
        // geographical covereage
        const geographicalCovereageDataList = datalists.find((d) => d[0].dataListName === AppConstants.DATA_LIST_NAMES.GEOGRAPHICAL_COVERAGE);
        const userGeographicalCoverage = geographicalCovereageDataList.find(d => d.code == this._userInfo[AppWizardConstants.USER_INFO_PROPERTIES.COVERAGE_AREA]);
        this._coverageArea = userGeographicalCoverage ? userGeographicalCoverage.title : '';
        // duration
        const durationDataList = datalists.find((d) => d[0].dataListName === AppConstants.DATA_LIST_NAMES.DURATION);
        const userTrpDuration = durationDataList.find(d => d.code == this._userInfo[AppWizardConstants.USER_INFO_PROPERTIES.TRIP_DURATION]);
        this._tripDuration = userTrpDuration ? userTrpDuration.title : '';
      }
    });
  }

  private loadGlobalVariables() {
    const routeResolversData = this._activatedRoute.snapshot.data;
    if (routeResolversData) {
      const globalVariables = routeResolversData.globalVariables;
      const offersRowsPerPage = globalVariables.find((c) => c.name === AppConstants.GLOBAL_VARIABLE_NAMES.OFFERS_ROWS_PER_PAGE);
      this._offersRowsPerPage = offersRowsPerPage.value;
    }
  }

  private setUserInfo() {
    this._userInfo = LocalStorageService.getFromLocalStorage(AppConstants.LOCAL_STORAGE.USER_INFO, null, false);
  }

  private setAge() {
    const dob = this._userInfo[AppWizardConstants.USER_INFO_PROPERTIES.DOB];
    const age = UtilsService.getAge(new Date(dob.year, dob.month, dob.day));
    this._age = age ? age.toString() : '';
  }

  private setTravelType() {
    const travelTypes: Array<{ code: string, key: string }> = [
      {
        code: AppWizardConstants.TRAVEL_TYPES.CODES.INDIVIDUAL,
        key: AppWizardConstants.TRAVEL_TYPES.TRANSLATION_KEYS.INDIVIDUAL
      },
      {
        code: AppWizardConstants.TRAVEL_TYPES.CODES.FAMILY,
        key: AppWizardConstants.TRAVEL_TYPES.TRANSLATION_KEYS.FAMILY
      }
    ];
    const userTravelType = travelTypes.find(t => t.code == this._userInfo[AppWizardConstants.USER_INFO_PROPERTIES.TYPE]);
    this._travelTypeKey = userTravelType.key;
  }

  private initOffers() {
    const routeResolversData = this._activatedRoute.snapshot.data;
    this._offers = routeResolversData.offerResult && routeResolversData.offerResult.offers ? routeResolversData.offerResult.offers : [];
    this._offersDimensions = routeResolversData.offerResult && routeResolversData.offerResult.dimensions ? routeResolversData.offerResult.dimensions : [];
    this._offerViews = this.mapOffersToOfferViews(this._offers);
  }

  private mapOffersToOfferViews(offers: Array<Offer>): OffersView {
    const smiDimension = this._offersDimensions ? this._offersDimensions.find(d => d.name == OffersConstants.DIMENSION.NAMES.SMI) : null;
    const offersPayload = smiDimension && smiDimension.policyLevel ? smiDimension.policyLevel : this._userInfo;
    const offersView = new OffersView();
    offersView.numberPerPage = this._offersRowsPerPage;
    offersView.offers = offers.map(offer => this.mapOfferToOfferView(offer, offersPayload));
    return offersView;
  }

  private mapOfferToOfferView(offer: Offer, offersPayload: any) {
    const offerView = new OfferView();
    offerView.code = offer.code;
    offerView.currency = offer.currency;
    offerView.title = offer.titleTranslation;
    offerView.premium = this.getPremium(offer);
    offerView.logoUrl = this.getLogoUrl(offer.entityId);
    offerView.benefits = offer.benefits ? this.mapBenefitsToBenefitViews(offer.benefits) : [];
    const flattenedProperties = offer && offer.benefits ? this.flattenBenefitProperties(offer.benefits) : [];
    offerView.checkboxes = this.getOfferViewCheckboxes(offer, offersPayload, flattenedProperties);
    offerView.highlightedProperties = this.getHighlightedProperties(flattenedProperties);
    return offerView;
  }

  private getPremium(offer: Offer): number {
    return offer.price;
  }

  private getLogoUrl(entityId: number): string {
    return `../../../../../assets/images/company-logos/${entityId}.svg`;
  }

  private mapBenefitsToBenefitViews(benefits: Array<Benefit>): Array<BenefitView> {
    return benefits.map((benefit) => {
      const benefitView = new BenefitView();
      benefitView.code = benefit.code;
      benefitView.properties = benefit.properties ? this.mapBenefitPropertiesToBenefitPropertyViews(benefit.properties) : [];
      return benefitView;
    });
  }

  private mapBenefitPropertiesToBenefitPropertyViews(properties: Array<BenefitProperty>): Array<PropertyView> {
    return properties.map((property) => {
      const propertyView = new PropertyView();
      propertyView.code = property.code;
      propertyView.isOptional = property.isOptional;
      propertyView.tags = property.tags;
      propertyView.value = property.value;
      return propertyView;
    });
  }

  private getHighlightedProperties(flattenedProperties: Array<BenefitProperty>): Array<HighlightedProperty> {
    return flattenedProperties
      .filter(property => property && property.tags && property.tags.includes(OffersConstants.TAGS.BENEFIT.HIGHLIGHT))
      .map((property) => {
        const highlightedProperty = new HighlightedProperty();
        highlightedProperty.checked = property.value != 0;
        highlightedProperty.title = property.titleTranslation;
        return highlightedProperty;
      });
  }

  private getOfferViewCheckboxes(
    offer: Offer,
    offersPayload: { [key: string]: any },
    flattenedBenefitProperties: Array<BenefitProperty> = null
  ): { title: LocalizedValue[]; value: LocalizedValue[]; checked: boolean; propertyName: string }[] {
    const checkboxes = new Array<{ title: LocalizedValue[]; value: LocalizedValue[]; checked: boolean; propertyName: string }>();
    if (isNull(flattenedBenefitProperties)) {
      flattenedBenefitProperties = offer && offer.benefits ? this.flattenBenefitProperties(offer.benefits) : [];
    }
    flattenedBenefitProperties.forEach((property) => {
      if (this.isOfferListItemHeader(property) && property.isOptional) {
        const rate = offer.detailedPrice.policyLevel.find(v => v.name == property.code);
        if (rate && rate.total) {
          const propertyName = this.getOfferListItemHeaderPropertyName(property.tags);
          const checkbox = {
            title: property.titleTranslation,
            value: property.displayValueTranslation,//rate.total.toString(),
            propertyName: propertyName,
            checked: this.isItemHeaderPropertyChecked(propertyName, offersPayload)
          }
          checkboxes.push(checkbox);
        }
      }
    });
    return checkboxes;
  }

  private getOfferListItemHeaderPropertyName(tags: string): string {
    const tagsArray = tags.split(OffersConstants.SEPERATORS.TAGS);
    const payloadPropertyName = tagsArray[1];
    if (!isNullOrUndefined(payloadPropertyName)) {
      const camelCasePayloadPropertyName = payloadPropertyName.charAt(0).toLowerCase() + payloadPropertyName.slice(1);
      return camelCasePayloadPropertyName;
    }
  }

  private isItemHeaderPropertyChecked(propertyName: string, offersPayload: { [key: string]: any; }): boolean {
    return propertyName && offersPayload[propertyName] == OffersConstants.OFFER_PAYLOAD_PROPERTIES.CODES.YES;
  }

  private isOfferListItemHeader(property: BenefitProperty) {
    return property &&
      property.tags &&
      property.tags.includes(OffersConstants.TAGS.BENEFIT_PROPERTY.OFFER_LIST_ITEM_HEADER);
  }

  private flattenBenefitProperties(benefits: Array<Benefit>): Array<BenefitProperty> {
    if (benefits) {
      return benefits.reduce(
        (propertiesAccumulaor, benefit) => {
          if (benefit.properties) {
            propertiesAccumulaor.push(...benefit.properties);
          }
          return propertiesAccumulaor;
        },
        new Array<BenefitProperty>()
      );
    }
    return [];
  }

  private async repriceOffer(offerCode: string, userInfo: any): Promise<void> {
    // Reprice and get result
    const result = await this._offersService.repriceOffer(offerCode, userInfo).toPromise<OfferResult>();
    const offer = result && result.offers ? result.offers[0] : null;
    // Get offer updated payload
    const smiDimension = result && result.dimensions ? result.dimensions.find(d => d.name == OffersConstants.DIMENSION.NAMES.SMI) : null;
    const offersPayload = smiDimension && smiDimension.policyLevel ? smiDimension.policyLevel : this._userInfo;
    // Map offer to view
    const offerView = offer && offersPayload ? this.mapOfferToOfferView(offer, offersPayload) : null;
    // Remove or replace old offer by repriced offer
    const offerIndex = this._offers.findIndex(o => o.code == offerCode);
    if (offerIndex != -1) {
      offer ? this._offers.splice(offerIndex, 1, offer) : this._offers.splice(offerIndex, 1);
    }
    // Remove or replace old offer view by repriced offer
    const offerViewIndex = this._offerViews.offers.findIndex(o => o.code == offerCode);
    if (offerIndex != -1) {
      offerView ? this._offerViews.offers.splice(offerViewIndex, 1, offerView) : this._offerViews.offers.splice(offerViewIndex, 1);
    }
  }
  //#endregion
}
