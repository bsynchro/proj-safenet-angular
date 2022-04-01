import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Translations } from 'src/app/shared/services/translation.service';
import { PolicyConstants } from '../../constants/policy.constants';
import { IssuePolicyResult } from '../../models/issue-policy-result.model';

@Component({
  selector: 'app-policy-download',
  templateUrl: './policy-download.component.html',
  styleUrls: ['./policy-download.component.scss']
})
export class PolicyDownloadComponent implements OnInit {
  //#region fields
  private _policyUrl: string;
  private _policyId: string;
  private _policyIssued: boolean;
  //#endregion

  //#region getters
  public get policyUrl(): string {
    return this._policyUrl;
  }

  public get policyFileName(): string {
    return `${PolicyConstants.POLICY_FILE_NAME} - ${this._policyId}`;
  }

  public get policyIssued(): boolean {
    return this._policyIssued;
  }
  //#endregion

  //#region ctor
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _loaderService: LoaderService,
    public translations: Translations
  ) { }
  //#endregion

  //#region lifecycle hooks
  ngOnInit() {
    this.setPolicyProperties();
  }
  //#endregion

  //#region public methods
  public downloadPolicy() {
    this._loaderService.showManualLoader();
    saveAs(this._policyUrl, `${PolicyConstants.POLICY_FILE_NAME} - ${this._policyId}`);
    this._loaderService.hideManualLoader();
  }
  //#endregion

  //#region private methods
  private setPolicyProperties() {
    const routeResolversData = this._activatedRoute.snapshot.data;
    if (routeResolversData) {
      const issuePolicyResult = routeResolversData.issuePolicyResult as IssuePolicyResult;
      if (issuePolicyResult && issuePolicyResult.policyUrl) {
        this._policyIssued = issuePolicyResult && !issuePolicyResult.errorMessage;
        this._policyUrl = issuePolicyResult.policyUrl;
        this._policyId = issuePolicyResult.id;
      }
    }
  }
  //#endregion
}
