import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RouteGuardService } from "src/app/core/auth-callback/route.guard";
import { AppConstants } from "src/app/shared/constants/app.constants";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";

const userRoutes: Routes = [
    {
        path: AppConstants.ROUTES.CHANGE_PASSWORD,
        component: ChangePasswordComponent,
        canActivate: [RouteGuardService],
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: AppConstants.ROUTES.CHANGE_PASSWORD
    }
]

export const UserRoutesModule: ModuleWithProviders = RouterModule.forChild(userRoutes);