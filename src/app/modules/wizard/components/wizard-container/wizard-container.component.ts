import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EventPayload, Step, WizardComponent } from '@bsynchro/services';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { AppWizardConstants } from '../../constants/wizard.constants';

@Component({
  selector: 'app-wizard-container',
  templateUrl: './wizard-container.component.html',
  styleUrls: ['./wizard-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WizardContainerComponent implements OnInit {
  //#region decorators
  @ViewChild('wizard', { static: false }) wizard: WizardComponent;
  //#endregion

  //#region fields
  private _sections: Array<any> = [
    {
      name: AppWizardConstants.SECTION_NAMES.TRAVEL_DESTINATION,
      order: 0
    },
    {
      name: AppWizardConstants.SECTION_NAMES.TRAVEL_DURATION,
      order: 1
    },
    {
      name: AppWizardConstants.SECTION_NAMES.DOB,
      order: 2
    },
    {
      name: AppWizardConstants.SECTION_NAMES.TRAVEL_TYPE,
      order: 3
    },
  ];
  private _editMode: boolean = false;
  private _initialStep: number = 0;
  private _formGroup: FormGroup;
  //#endregion

  //#region getters
  public get sections(): Array<Step> {
    return this._sections;
  }

  public get editMode(): boolean {
    return this._editMode;
  }

  public get initialStep(): number {
    return this._initialStep;
  }

  public get formGroup(): FormGroup {
    return this._formGroup;
  }

  public get isValid(): boolean {
    return this.wizard && this.wizard.stepsArray.every(s => s.isValid());
  }
  //#endregion

  //#region ctor
  constructor(private _fb: FormBuilder, private _router: Router) {
    this._formGroup = this._fb.group({});
  }
  //#endregion

  //#region lifecycle hooks
  ngOnInit() {
  }
  //#endregion

  //#region public methods
  public triggerWizardValidation(selectedIndex: number) {
    this.wizard.isValid(selectedIndex);
  }

  public async nextEventHandler(event: EventPayload) {
    if (this.isLastStep() && this.wizard.isValid()) {
      this.navigateToGetOffers();
      // Manually set alreadyTriggered to true to avoid emitNext loop
      this.wizard.stepsArray[this.wizard.selectedIndex].alreadyTriggered = true;
    }
  }
  //#endregion

  //#region private methods
  private isLastStep(): boolean {
    return this.wizard &&
      this.wizard.selectedIndex &&
      this.wizard.stepsArray &&
      this.wizard.stepsArray.length &&
      this.wizard.selectedIndex &&
      this.wizard.selectedIndex == this.wizard.stepsArray.length - 1;
  }

  private navigateToGetOffers() {
    this._router.navigate([AppConstants.ROUTES.MAIN, AppConstants.ROUTES.OFFERS]);
  }
  //#endregion
}
