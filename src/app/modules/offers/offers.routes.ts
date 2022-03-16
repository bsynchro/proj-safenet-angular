import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RouteGuardService } from "src/app/core/auth-callback/route.guard";
import { OffersDatalistResolver } from "src/app/core/resolvers/data-list.resolver";
import { OffersGlobalVariablesResolver } from "src/app/core/resolvers/global-variable.resolver";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { OffersListComponent } from "./components/offers-list/offers-list.component";
import { UpsellingComponent } from "./components/upselling/upselling.component";
import { CheckoutResolver } from "./resolvers/checkout.resolver";
import { OffersResolver } from "./resolvers/offers.resolver";

const offersRoutes: Routes = [
    {
        path: '',
        component: OffersListComponent,
        resolve: {
            dataLists: OffersDatalistResolver,
            offerResult: OffersResolver,
            globalVariables: OffersGlobalVariablesResolver
        }
    },
    {
        path: AppConstants.ROUTES.CHECKOUT,
        component: UpsellingComponent,
        canActivate: [RouteGuardService],
        resolve: {
            purchaseOfferPayload: CheckoutResolver
        }
    }
]

export const OffersRouterModule: ModuleWithProviders = RouterModule.forChild(offersRoutes);