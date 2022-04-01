import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PolicyDownloadComponent } from "./components/policy-download/policy-download.component";
import { PolicyResolver } from "./resolvers/policy.resolver";

const policyRoutes: Routes = [
    {
        path: ':quoteId',
        component: PolicyDownloadComponent,
        resolve: {
            issuePolicyResult: PolicyResolver
        },
    },
]

export const PoolicyRouterModule: ModuleWithProviders = RouterModule.forChild(policyRoutes);