import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SilentRefreshComponent } from '@bsynchro/services';
import { AuthCallbackComponent } from './core/auth-callback/auth-callback.component';
import { AuthGuardService } from './core/auth-callback/auth.guard';
import { LanguageResolver } from './core/resolvers/language.resolver';
import { AppConstants } from './shared/constants/app.constants';


const routes: Routes = [
  {
    path: '',
    canLoad: [AuthGuardService],
    loadChildren: './core/core.module#CoreModule',
    resolve: {
      LanguageResolver
    },
  },
  {
    path: AppConstants.ROUTES.CALLBACK,
    component: AuthCallbackComponent
  },
  {
    path: AppConstants.ROUTES.REFRESH,
    component: SilentRefreshComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
