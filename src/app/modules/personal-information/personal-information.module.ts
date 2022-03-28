import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalInformationComponent } from './components/personal-information.component';
import { PersonalInformationRouterModule } from './personal-information.routes';
import { PersonalInformationDatalistResolver } from 'src/app/core/resolvers/data-list.resolver';
import { DropdownModule } from 'primeng/dropdown';
import { PaymentValidityResolver } from '../../shared/resolvers/payment-validity.resolver';
import { PaymentService } from '../offers/services/payment.service';
import { PersonalInformationResolver } from './resolvers/personal-information.resolver';
import { BeneficiaryService } from './components/services/beneficiary.service';

import { ToggleButtonModule } from 'primeng/togglebutton';
@NgModule({
  declarations: [
    PersonalInformationComponent
  ],
  imports: [
    PersonalInformationRouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DropdownModule,
    ToggleButtonModule
  ],
  providers: [
    PaymentService,
    BeneficiaryService,
    PersonalInformationDatalistResolver,
    PersonalInformationResolver,
    PaymentValidityResolver
  ]
})
export class PersonalInformationModule { }
