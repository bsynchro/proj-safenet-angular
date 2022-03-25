import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { PersonalInformationComponent } from "./components/personal-information.component";
import { PersonalInformationDatalistResolver } from "src/app/core/resolvers/data-list.resolver";
import { PaymentValidityResolver } from './resolvers/personal-information.resolver';

const personalInformationRoutes: Routes = [
    {
        path: '',
        component: PersonalInformationComponent,
        resolve: {
            dataLists: PersonalInformationDatalistResolver,
            paymentValidity: PaymentValidityResolver
        },
    },
    {
        path: `:${AppConstants.ROUTE_DATA_KEYS.QUOTE_ID}`,
        component: PersonalInformationComponent,
        resolve: {
            dataLists: PersonalInformationDatalistResolver,
            paymentValidity: PaymentValidityResolver
        }
    }
]

export const PersonalInformationRouterModule: ModuleWithProviders = RouterModule.forChild(personalInformationRoutes);