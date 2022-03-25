import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RouteGuardService } from "src/app/core/auth-callback/route.guard";
import { CheckoutDatalistResolver, OffersDatalistResolver } from "src/app/core/resolvers/data-list.resolver";
import { OffersGlobalVariablesResolver } from "src/app/core/resolvers/global-variable.resolver";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { OffersListComponent } from "./components/offers-list/offers-list.component";
import { CheckoutComponent } from "./components/checkout/checkout.component";
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
        component: CheckoutComponent,
        canActivate: [RouteGuardService],
        resolve: {
            resolvedData: CheckoutResolver,
            dataLists: CheckoutDatalistResolver,
        }
    },
    {
        path: `${AppConstants.ROUTES.CHECKOUT}/:${AppConstants.ROUTE_DATA_KEYS.QUOTE_ID}/:${AppConstants.ROUTE_DATA_KEYS.PAYMENT_FLAG}`,
        component: CheckoutComponent,
        canActivate: [RouteGuardService],
        resolve: {
            resolvedData: CheckoutResolver,
            dataLists: CheckoutDatalistResolver,
        }
    },
    {
        path: `${AppConstants.ROUTES.CHECKOUT}/:${AppConstants.ROUTE_DATA_KEYS.QUOTE_ID}/:${AppConstants.ROUTE_DATA_KEYS.PAYMENT_FLAG}/:${AppConstants.ROUTE_DATA_KEYS.PAYMENT_ERROR_CODE}`,
        component: CheckoutComponent,
        canActivate: [RouteGuardService],
        resolve: {
            resolvedData: CheckoutResolver,
            dataLists: CheckoutDatalistResolver,
        }
    }
]

export const OffersRouterModule: ModuleWithProviders = RouterModule.forChild(offersRoutes);