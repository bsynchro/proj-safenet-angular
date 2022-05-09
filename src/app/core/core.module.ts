import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { LanguageResolver } from './resolvers/language.resolver';
import { environment } from 'src/environments/environment';
import { CoreRouterModule } from './core.routes';
import { AuthorizationModule, BSynchroServices, DataListService, TranslationModule } from '@bsynchro/services';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from '../shared/shared.module';
import { INTERCEPTOR_PROVIDER } from './interceptors/interceptor-provider';
import { BroadcastService } from '../shared/services/broadcast.service';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UserService } from '../shared/services/user.service';


@NgModule({
  declarations: [HomeComponent, HeaderComponent],
  imports: [
    CoreRouterModule,
    CommonModule,
    TranslationModule,
    BSynchroServices,
    DropdownModule,
    SharedModule,
    AuthorizationModule,
    MenuModule,
    ConfirmDialogModule
  ],

  providers: [
    INTERCEPTOR_PROVIDER,
    {
      provide: 'environment',
      useValue: environment
    },
    BroadcastService,
    LanguageResolver,
    DataListService,
    UserService
  ]
})
export class CoreModule { }
