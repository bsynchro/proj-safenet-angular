import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTranslationPipe, LocalizedValue, SerializationService, UITranslateService } from '@bsynchro/services';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppWizardConstants } from 'src/app/modules/wizard/constants/wizard.constants';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { CrmConstants } from 'src/app/shared/constants/crm.constants';
import { Contact, Quote } from 'src/app/shared/models/crm.model';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Translations } from 'src/app/shared/services/translation.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { isNullOrUndefined } from 'util';
import { OffersConstants } from '../../constants/offers.constants';
import { OfferResult } from '../../models/offer-result.model';
import { Benefit, BenefitProperty, Offer } from '../../models/offer.model';
import { GetOffersPayload } from '../../models/offers-payload.model';
import { UpsellingCover } from '../../models/offers-view.model';
import { OffersService } from '../../services/offers.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DateTranslationPipe, DatePipe]
})
export class CheckoutComponent implements OnInit {

  //#region fields
  private _userInfo: any;
  private _quote: Quote;
  private _offer: Offer;
  private _contact: Contact;
  private _coverageArea: string = '';
  private _travelTypeKey: string = '';
  private _age: string = '';
  private _tripDuration: { from: Date, to: Date } = { from: new Date(), to: new Date() };
  private _productLogoUrl: string = '';
  private _upsellingCovers: Array<UpsellingCover> = [];
  private _addedCovers: Array<UpsellingCover> = [];
  private _addedCoupons: Array<{ code: string, value: number }> = [];
  private _smiPayload: { [key: string]: any };
  private _grandTotal: number = 0;
  private _languageSubscription: Subscription = new Subscription();
  //#endregion

  //#region getters
  public get coverageArea(): string {
    return this._coverageArea;
  }

  public get travelTypeKey(): string {
    return this._travelTypeKey;
  }

  public get age(): string {
    return this._age;
  }

  public get tripDuration(): { from: Date, to: Date } {
    return this._tripDuration;
  }

  public get productLogoUrl(): string {
    return this._productLogoUrl;
  }

  public get upsellingCovers(): Array<UpsellingCover> {
    return this._upsellingCovers;
  }

  public get addedCovers(): Array<UpsellingCover> {
    return this._addedCovers;
  }

  public get offer(): Offer {
    return this._offer;
  }

  public get addedCoupons(): Array<{ code: string, value: number }> {
    return this._addedCoupons;
  }

  public get locale(): string {
    return this._translateService.currentLanguage;
  }

  public get grandTotal(): number {
    return this._grandTotal;
  }

  public get offerPrice(): number {
    return this._offer.price - this._addedCovers.reduce((total, cover) => total += cover.value, 0);
  }
  //#endregion

  //#region setters
  //#endregion

  //#region ctor
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _offersService: OffersService,
    private _serializationService: SerializationService,
    private _translateService: UITranslateService,
    public translations: Translations
  ) { }
  //#endregion

  //#region lifecycle hooks
  ngOnInit() {
    this.setUserInfo();
    this.setQuote();
    this.setOffer();
    this.setContact();
    this.handleLanguageChange();
    this.setTravelType();
    this.setAge();
    this.setTripDuration();
    this.setLogoUrl();
    this.setOfferPayload();
    this.setUpsellingCovers();
  }
  //#endregion

  //#region public methods
  public back() {
    this._router.navigate([AppConstants.ROUTES.MAIN, AppConstants.ROUTES.OFFERS])
  }

  public getLocalizedValue(translations: Array<LocalizedValue>) {
    return this._translateService.getTranslationFromArray(translations);
  }

  public async onCheckboxCheck(checked: boolean, propertyName: string) {
    // Get user info with updated checkbox value
    const userInfo = Object.assign({}, this._userInfo);
    userInfo[propertyName] = checked ?
      OffersConstants.OFFER_PAYLOAD_PROPERTIES.CODES.YES :
      OffersConstants.OFFER_PAYLOAD_PROPERTIES.CODES.NO;
    // Reprice
    await this.repriceOffer(this._offer.code, userInfo)
  }

  public checkout() {

  }
  //#endregion

  //#region helpers
  private setUserInfo() {
    this._userInfo = LocalStorageService.getFromLocalStorage(AppConstants.LOCAL_STORAGE.USER_INFO, null, false);
  }

  private setQuote() {
    const routeResolversData = this._activatedRoute.snapshot.data;
    if (routeResolversData) {
      this._quote = routeResolversData.purchaseOfferPayload.quote;
    }
  }

  private setOffer() {
    this._offer = this._serializationService.camelizeObjectKeys(JSON.parse(this._quote.products[0].metadata[CrmConstants.QUOTE_PRODUCT_METADATA.OFFER])) as Offer;
  }

  private setContact() {
    const routeResolversData = this._activatedRoute.snapshot.data;
    if (routeResolversData) {
      this._contact = routeResolversData.purchaseOfferPayload.contact;
    }
  }

  private handleLanguageChange() {
    this._languageSubscription.unsubscribe();
    this._languageSubscription = this._translateService.onLanguageChange.subscribe(res => {
      this.loadDataLists();
    });
  }

  private loadDataLists() {
    const routeResolversData = this._activatedRoute.snapshot.data;
    if (routeResolversData) {
      const datalists = this._translateService.getLocalizedDataLists(routeResolversData.dataLists);
      // geographical covereage
      const geographicalCovereageDataList = datalists.find((d) => d[0].dataListName === AppConstants.DATA_LIST_NAMES.GEOGRAPHICAL_COVERAGE);
      const userGeographicalCoverage = geographicalCovereageDataList.find(d => d.code == this._userInfo[AppWizardConstants.USER_INFO_PROPERTIES.COVERAGE_AREA]);
      this._coverageArea = userGeographicalCoverage ? userGeographicalCoverage.title : '';
    }
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

  private setAge() {
    const dob = this._userInfo[AppWizardConstants.USER_INFO_PROPERTIES.DOB];
    const age = UtilsService.getAge(new Date(dob.year, dob.month, dob.day));
    this._age = age ? age.toString() : '';
  }

  private setTripDuration() {
    const duration = this._userInfo[AppWizardConstants.USER_INFO_PROPERTIES.TRIP_DURATION];
    this._tripDuration.from = duration.from instanceof Date ? duration.from : new Date(duration.from);
    this._tripDuration.to = duration.to instanceof Date ? duration.to : new Date(duration.to);
  }

  private setLogoUrl() {
    const entityId = this._quote.products[0].extendedProperties[CrmConstants.QUOTE_PRODUCT_EXTENDED_PROPERTIES.ENTITY_ID];
    this._productLogoUrl = `../../../../../assets/images/company-logos/${entityId}.svg`;
  }

  private setOfferPayload() {
    this._smiPayload = this._quote.products[0].coraMetadata.smiPayload;
  }

  private setUpsellingCovers() {
    const flattenedBenefitProperties = this.flattenBenefitProperties(this._offer.benefits);
    const upsellingCovers = new Array<UpsellingCover>();
    flattenedBenefitProperties.forEach((property) => {
      if (this.isUpsellingCover(property) && property.isOptional) {
        const propertyName = this.getUpsellingCoverPropertyName(property.tags);
        const rate = this._offer.detailedPrice.policyLevel.find(v => v.name == propertyName.charAt(0).toUpperCase() + propertyName.slice(1));
        const cover = new UpsellingCover();
        cover.code = property.code;
        cover.title = property.titleTranslation;
        cover.description = property.descriptionTranslation;
        cover.propertyName = propertyName;
        cover.checked = this.isUpsellingCoverChecked(propertyName);
        cover.value = rate.total;
        upsellingCovers.push(cover);
      }
    });
    this._upsellingCovers = upsellingCovers;
    this.setAddedCovers();
    this.setGrandTotal();
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

  private isUpsellingCover(property: BenefitProperty): boolean {
    return property && property.tags && property.tags.includes(OffersConstants.TAGS.BENEFIT_PROPERTY.UPSELLING);
  }

  private isUpsellingCoverChecked(propertyName: string): boolean {
    return propertyName && this._smiPayload[propertyName] == OffersConstants.OFFER_PAYLOAD_PROPERTIES.CODES.YES;
  }

  private getUpsellingCoverPropertyName(tags: string): string {
    const tagsArray = tags.split(OffersConstants.SEPERATORS.TAGS);
    const payloadPropertyName = tagsArray[1];
    if (!isNullOrUndefined(payloadPropertyName)) {
      const camelCasePayloadPropertyName = payloadPropertyName.charAt(0).toLowerCase() + payloadPropertyName.slice(1);
      return camelCasePayloadPropertyName;
    }
  }

  private async repriceOffer(offerCode: string, userInfo: any): Promise<void> {
    // Reprice and get result
    const result = await this._offersService.repriceOffer(offerCode, userInfo).toPromise<OfferResult>();
    // Update offer
    if (result && result.offers && result.offers.length) {
      this._offer = result.offers[0];
    }
    // Update smi payload
    const smiDimension = result && result.dimensions ? result.dimensions.find(d => d.name == OffersConstants.DIMENSION.NAMES.SMI) : null;
    if (smiDimension && smiDimension.policyLevel) {
      this._smiPayload = smiDimension.policyLevel;
    }
    // Update upselling covers
    this.setUpsellingCovers();
    // Update grand total
    this.setGrandTotal();
  }

  private setAddedCovers() {
    this._addedCovers = this._upsellingCovers.filter(c => c.checked);
  }

  private setGrandTotal() {
    const addedCoversPrice = this._addedCovers.reduce((total, cover) => total += cover.value, 0);
    const addedCouponssPrice = this._addedCoupons.reduce((total, coupon) => total += coupon.value, 0);
    this._grandTotal = this._offer.price + addedCouponssPrice;
  }
  //#endregion
}
