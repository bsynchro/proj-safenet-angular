import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalInformationComponent } from './components/personal-information.component';
import { PersonalInformationRouterModule } from './personal-information.routes';
import { PersonalInformationDatalistResolver } from 'src/app/core/resolvers/data-list.resolver';
import { DropdownModule } from 'primeng/dropdown';

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
    DropdownModule
  ],
  providers: [
    PersonalInformationDatalistResolver
  ]
})
export class PersonalInformationModule { }