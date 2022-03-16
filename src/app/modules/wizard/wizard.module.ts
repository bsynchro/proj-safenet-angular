import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardContainerComponent } from './components/wizard-container/wizard-container.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WizardModule } from '@bsynchro/services';
import { TravelDestinationComponent } from './components/travel-destination/travel-destination.component';
import { TravelDurationComponent } from './components/travel-duration/travel-duration.component';
import { WizardRouterModule } from './wizard.routes';
import { WizardDatalistResolver } from 'src/app/core/resolvers/data-list.resolver';
import { DateOfBirthComponent } from './components/date-of-birth/date-of-birth.component';
import { TravelTypeComponent } from './components/travel-type/travel-type.component';
import { WizardGlobalVariablesResolver } from 'src/app/core/resolvers/global-variable.resolver';



@NgModule({
  declarations: [
    WizardContainerComponent,
    TravelDestinationComponent,
    TravelDurationComponent,
    DateOfBirthComponent,
    TravelTypeComponent
  ],
  imports: [
    WizardRouterModule,
    CommonModule,
    WizardModule,
    SharedModule
  ],
  providers: [
    WizardDatalistResolver,
    WizardGlobalVariablesResolver
  ]
})
export class AppWizardModule { }
