import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { PersonalInformationDatalistResolver } from "src/app/core/resolvers/data-list.resolver";
import { PersonalInformationResolver } from './resolvers/personal-information.resolver';
import { PersonalInformationComponent } from './components/personal-information/personal-information.component';

const personalInformationRoutes: Routes = [
    {
        path: '',
        component: PersonalInformationComponent,
        resolve: {
            dataLists: PersonalInformationDatalistResolver,
            resolvedData: PersonalInformationResolver
        },
    },
    {
        path: ':quoteId',
        component: PersonalInformationComponent,
        resolve: {
            dataLists: PersonalInformationDatalistResolver,
            beneficiariesResult: PersonalInformationResolver
        }
    }
]

export const PersonalInformationRouterModule: ModuleWithProviders = RouterModule.forChild(personalInformationRoutes);