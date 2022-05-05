import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RouteGuardService } from "src/app/core/auth-callback/route.guard";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { ProductionReportComponent } from "./components/production-report/production-report.component";

const producerRoutes: Routes = [
    {
        path: AppConstants.ROUTES.PRODUCTION_REPORT,
        component: ProductionReportComponent,
        canActivate: [RouteGuardService],
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: AppConstants.ROUTES.PRODUCTION_REPORT
    }
]

export const ProducerRoutesModule: ModuleWithProviders = RouterModule.forChild(producerRoutes);