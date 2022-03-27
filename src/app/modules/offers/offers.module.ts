import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { OffersRouterModule } from './offers.routes';
import { OffersListComponent } from './components/offers-list/offers-list.component';
import { OffersResolver } from './resolvers/offers.resolver';
import { CheckoutDatalistResolver, OffersDatalistResolver } from 'src/app/core/resolvers/data-list.resolver';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
import { OffersService } from './services/offers.service';
import { OffersGlobalVariablesResolver } from 'src/app/core/resolvers/global-variable.resolver';
import { FormsModule } from '@angular/forms';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CheckoutResolver } from './resolvers/checkout.resolver';
import { PipesModule } from '@bsynchro/services';
import { PaymentService } from './services/payment.service';
import { CheckoutPaymentValidityResolver } from './resolvers/checkout-payment-validity.resolver';
import { PaymentValidityResolver } from '../../shared/resolvers/payment-validity.resolver';
import { PurchaseOfferResolver } from './resolvers/purchase-offer.resolver';


@NgModule({
  declarations: [
    OffersListComponent,
    CheckoutComponent
  ],
  imports: [
    OffersRouterModule,
    CommonModule,
    FormsModule,
    CheckboxModule,
    SharedModule,
    PipesModule
  ],
  providers: [
    OffersService,
    OffersResolver,
    OffersDatalistResolver,
    OffersGlobalVariablesResolver,
    PaymentValidityResolver,
    PurchaseOfferResolver,
    CheckoutPaymentValidityResolver,
    CheckoutResolver,
    CheckoutDatalistResolver,
    PaymentService
  ]
})
export class OffersModule { }
