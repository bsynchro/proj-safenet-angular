import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  //#region inputs
  @Input() show = false;
  //#endregion

  //#region ctor
  constructor() { }
  //#endregion

  //#region lifecycle hooks
  ngOnInit() {
  }
  //#endregion
}
