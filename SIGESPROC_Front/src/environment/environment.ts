// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    //  apiUrl: 'https://backendsigesproc-production.up.railway.app',
    apiUrl: 'https://localhost:44337',
    //  UrlFront: 'http://localhost:4200/#/sigesproc', //<---cambiar esto por la url del Frontend para las notificaciones
    apiKey: '4b567cb1c6b24b51ab55248f8e66e5cc',
      vapidKey: 'BKQVrX6fZ1gMVoy6K27edsmxWF8v0FJ3AYyUS2_l6cesTSDjo1zCqGW1dmUWbos8wqQKK5WwtJ_yWiqnwMqKgyk',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
