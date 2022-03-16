import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WizardDatalistResolver } from "src/app/core/resolvers/data-list.resolver";
import { WizardGlobalVariablesResolver } from "src/app/core/resolvers/global-variable.resolver";
import { WizardContainerComponent } from "./components/wizard-container/wizard-container.component";

const wizardRoutes: Routes = [
    {
        path: '',
        component: WizardContainerComponent,
        resolve: {
            dataLists: WizardDatalistResolver,
            globalVariables: WizardGlobalVariablesResolver
        }
    }
]

export const WizardRouterModule: ModuleWithProviders = RouterModule.forChild(wizardRoutes);