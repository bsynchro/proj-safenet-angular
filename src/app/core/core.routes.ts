import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SilentRefreshComponent } from "@bsynchro/services";
import { NotificationComponent } from "../shared/components/notification/notification.component";
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
            },
            {
                path: AppConstants.ROUTES.PERSONALINFORMATION,
                loadChildren: () => import('../modules/personal-information/personal-information.module').then((mod) => mod.PersonalInformationModule)
            },
            {
                path: AppConstants.ROUTES.POLICY,
                loadChildren: () => import('../modules/policy/policy.module').then((mod) => mod.PolicyModule)
            },
            {
                path: AppConstants.ROUTES.PRODUCER,
                loadChildren: () => import('../modules/producer/producer.module').then((mod) => mod.ProducerModule)
            },
            {
                path: AppConstants.ROUTES.USER,
                loadChildren: () => import('../modules/user/user.module').then((mod) => mod.UserModule)
            },
            {
                path: AppConstants.ROUTES.NOTIFICATION,
                component: NotificationComponent
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