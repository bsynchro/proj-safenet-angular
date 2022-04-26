import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalizedValue, UITranslateService } from '@bsynchro/services';
import { Translations } from 'src/app/shared/services/translation.service';
import { OfferView, PropertyView } from '../../models/offers-view.model';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss']
})
export class OfferDetailsComponent implements OnInit {
  //#region decorators
  @Input() offer: OfferView;
  @Output() offerChange: EventEmitter<OfferView> = new EventEmitter<OfferView>();
  //#endregion
  //#region fields
  //#endregion

  //#region getters
  //#endregion

  //#region setters
  //#endregion

  //#region ctor
  constructor(
    private _translateService: UITranslateService,
    public translations: Translations
  ) { }
  //#endregion

  //#region lifecycle hooks
  ngOnInit() {
  }
  //#endregion

  //#region public methods
  public close() {
    this.offer.showDetails = false;
    this.offerChange.emit(this.offer);
  }

  public getLocalizedValue(translations: Array<LocalizedValue>) {
    return this._translateService.getTranslationFromArray(translations);
  }

  public isPropertyVisible(property: PropertyView) {
    return property.value && property.value != '0';
  }

  public shouldNotWrap(displayValue: Array<LocalizedValue>) {
    return this.getLocalizedValue(displayValue).trim().length < 15;
  }
  //#endregion

  //#region helpers
  //#endregion
}
