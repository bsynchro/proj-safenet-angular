import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SilentRefreshComponent } from "@bsynchro/services";
import { AppConstants } from "../shared/constants/app.constants";
import { AuthCallbackComponent } from "./auth-callback/auth-callback.component";
import { HomeComponent } from "./home/home.component";

const coreRoutes: Routes = [
    {
        path: AppConstants.ROUTES.MAIN,
        component: HomeComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('../modules/wizard/wizard.module').then((mod) => mod.AppWizardModule)
            },
            {
                path: AppConstants.ROUTES.OFFERS,
                loadChildren: () => import('../modules/offers/offers.module').then((mod) => mod.OffersModule)
            }
        ]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: AppConstants.ROUTES.MAIN
    }
]

export const CoreRouterModule: ModuleWithProviders = RouterModule.forChild(coreRoutes);