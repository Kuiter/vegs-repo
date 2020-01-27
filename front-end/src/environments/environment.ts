// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  /**@ignore */
  production: false,
  /**environment variable referencing the redirect url segment defined in proxy.config.json */
  apiURI: '/api',
  /**Dev max filesize for image upload. */
  maxFileSizeBits: 5000000,
  /**Display value for max filesize used in error messages. */
  maxFileSize: '5MB'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
