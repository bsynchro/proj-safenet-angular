import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { environment } from 'src/environments/environment';
import { LanguageResolver } from './core/resolvers/language.resolver';
import { Translations } from './shared/services/translation.service';
import { AuthenticationModule, DatalistModule } from '@bsynchro/services';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { from } from 'rxjs/internal/observable/from';
import { pluck } from 'rxjs/internal/operators/pluck';
import { HttpClientModule } from '@angular/common/http';
import { AppConstants } from './shared/constants/app.constants';
import { INTERCEPTOR_PROVIDER } from './core/interceptors/interceptor-provider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthCallbackComponent } from './core/auth-callback/auth-callback.component';

export class WebpackTranslateLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return from(import(`./../assets/i18n/${lang}_${environment.location.toLowerCase()}.ts`)).pipe(pluck('default'));
  }
}

@NgModule({
  declarations: [
    AppComponent, AuthCallbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DatalistModule,
    AuthenticationModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader
      }
    }),
    SharedModule
  ],
  exports: [AuthCallbackComponent],
  providers: [
    INTERCEPTOR_PROVIDER,
    {
      provide: 'environment',
      useValue: environment
    },
    {
      provide: 'oidcSettings',
      useValue: AppConstants.OIDC_CLIENT
    },
    {
      provide: 'userCaching',
      useValue: false
    },
    Translations,
    LanguageResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
