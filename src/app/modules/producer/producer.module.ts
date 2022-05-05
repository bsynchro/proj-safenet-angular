import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductionReportComponent } from '../producer/components/production-report/production-report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProducerRoutesModule } from './producer.routes';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { UserService } from 'src/app/shared/services/user.service';



@NgModule({
  declarations: [ProductionReportComponent],
  imports: [
    ProducerRoutesModule,
    CommonModule,
    CalendarModule,
    SharedModule
  ],
  providers: [
    UserService
  ]
})
export class ProducerModule { }
