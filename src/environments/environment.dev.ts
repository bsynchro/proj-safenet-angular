// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    name: 'dev',
    production: true,
    defaultLcid: 1033,
    location: 'LB',
    Portal: 'http://portal.safenet.dev.bsynchro.com',
    IdentityServer: 'http://safenet.identity-staging-mt.dev.bsynchro.com',
    DataLists: 'http://safenet.cora-api-staging-mt.dev.bsynchro.com/data-list',
    CRM: 'http://crm.safenet.dev.bsynchro.com',
    GlobalVariables: 'http://safenet.cora-api-staging-mt.dev.bsynchro.com/global-variable'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
