import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { RouteGuardService } from "src/app/core/auth-callback/route.guard";
import { CommonModule } from '@angular/common';
import { AppConstants } from "src/app/shared/constants/app.constants";
import { PersonalInformationComponent } from "./components/personal-information.component";
import { PersonalInformationDatalistResolver } from "src/app/core/resolvers/data-list.resolver";

const personalInformationRoutes: Routes = [
    {
        path: '',
        component: PersonalInformationComponent,
        resolve: {
            dataLists: PersonalInformationDatalistResolver,
            // personalInformationResult: PersonalInformationResolver
        }
    }
]

export const PersonalInformationRouterModule: ModuleWithProviders = RouterModule.forChild(personalInformationRoutes);