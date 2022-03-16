// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  name: 'local',
  production: false,
  defaultLcid: 1033,
  location: 'LB',
  Portal: 'http://localhost:4201',
  IdentityServer: 'http://localhost:63115',
  // IdentityServer: 'http://safenet.identity-staging-mt.dev.bsynchro.com',
  DataLists: 'http://localhost:23322',
  // DataLists: 'http://safenet.cora-api-staging-mt.dev.bsynchro.com/data-list',
  CRM: 'http://localhost:30282',
  // CRM: 'http://Crm-ls-egypt.libanosuisse.dev.bsynchro.com',
  GlobalVariables: 'http://localhost:52032',
  // GlobalVariables: 'http://safenet.cora-api-staging-mt.dev.bsynchro.com/global-variable'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
