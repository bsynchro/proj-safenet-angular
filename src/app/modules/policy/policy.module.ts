import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyDownloadComponent } from './components/policy-download/policy-download.component';
import { SharedModule } from '../../shared/shared.module';
import { PolicyResolver } from './resolvers/policy.resolver';
import { PoolicyRouterModule as PolicyRouterModule } from './poilcy.routes';
import { PolicyService } from './services/policy.service';



@NgModule({
  declarations: [PolicyDownloadComponent],
  imports: [
    PolicyRouterModule,
    CommonModule,
    SharedModule
  ],
  providers: [
    PolicyResolver,
    PolicyService
  ]
})
export class PolicyModule { }
