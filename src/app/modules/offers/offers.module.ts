import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { OffersRouterModule } from './offers.routes';
import { OffersListComponent } from './components/offers-list/offers-list.component';
import { OffersResolver } from './resolvers/offers.resolver';
import { OffersDatalistResolver } from 'src/app/core/resolvers/data-list.resolver';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
import { OffersService } from './services/offers.service';
import { OffersGlobalVariablesResolver } from 'src/app/core/resolvers/global-variable.resolver';
import { FormsModule } from '@angular/forms';
import { UpsellingComponent } from './components/upselling/upselling.component';
import { CheckoutResolver } from './resolvers/checkout.resolver';


@NgModule({
  declarations: [
    OffersListComponent,
    UpsellingComponent
  ],
  imports: [
    OffersRouterModule,
    CommonModule,
    FormsModule,
    CheckboxModule,
    SharedModule
  ],
  providers: [
    OffersService,
    OffersResolver,
    OffersDatalistResolver,
    OffersGlobalVariablesResolver,
    CheckoutResolver
  ]
})
export class OffersModule { }
