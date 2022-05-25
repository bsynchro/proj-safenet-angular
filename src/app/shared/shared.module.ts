import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationModule } from '@bsynchro/services';
import { DropdownModule } from 'primeng/dropdown';
import { LoaderComponent } from './components/loader/loader.component';
import { Translations } from './services/translation.service';
import { DropdownDatePickerComponent } from './components/dropdown-date-picker/dropdown-date-picker.component';
import { KeyboardAutoOpenMobileFixDirective } from './directives/keyboardAutoOpenMobileFixDirective';
import { AutoOpenPublisherDirective } from './directives/autoOpenPublisher';
import { AutoOpenDefaultDirective } from './directives/autoOpenDefault';
import { AutoOpenSubscribeToDirective } from './directives/autoOpenSubscribeTo';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationComponent } from './components/notification/notification.component';


@NgModule({
  declarations: [
    LoaderComponent,
    DropdownDatePickerComponent,
    AutoOpenPublisherDirective,
    AutoOpenDefaultDirective,
    AutoOpenSubscribeToDirective,
    KeyboardAutoOpenMobileFixDirective,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    TranslationModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    Translations
  ],
  exports: [
    TranslationModule,
    LoaderComponent,
    DropdownDatePickerComponent,
    AutoOpenPublisherDirective,
    AutoOpenDefaultDirective,
    AutoOpenSubscribeToDirective,
    KeyboardAutoOpenMobileFixDirective,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
