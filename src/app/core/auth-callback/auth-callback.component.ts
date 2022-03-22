import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@bsynchro/services';
import { PurchaseOfferPayload } from 'src/app/modules/offers/models/offers-payload.model';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'auth-callback',
  template: ''
})
export class AuthCallbackComponent implements OnInit {

  constructor(
    private _authService: AuthenticationService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._authService.completeAuthentication().then(res => {
      const route = [AppConstants.ROUTES.MAIN];      
      // Redirect to checkout if in the process of purchasing, else redirect home
      if (this.isPurchasing()) {
        route.push(AppConstants.ROUTES.OFFERS, AppConstants.ROUTES.CHECKOUT);
      }
      this._router.navigate(route);
    });
  }

  private isPurchasing(): boolean {
    return !!LocalStorageService.getFromLocalStorage<PurchaseOfferPayload>(AppConstants.LOCAL_STORAGE.PURCHASE_OFFER_PAYLOAD);
  }

}
