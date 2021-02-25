// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  v: "3.0.0",
  ENVIROMENT: "DEV",
  // apiUrl:"http://192.168.0.82:9000/api/v1",
  // apiUrl: "http://localhost:80/services/apicrm.php?url=",
  // apiUrl:"/api/api/v1",
  apiUrl:"https://apicrm.betplay.com.co/api/v1",
  // kambiUrl:"https://cts-static.kambi.com/sb-mobileclient/bp/kambi-bootstrap.js?cb=",
  // kambiUrl: "https://c3-static.kambi.com/client/betplay/kambi-bootstrap.js?cb=",
  apiPayU:" https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi",
  kambiUrl:"https://ctn-static.kambi.com/sb-mobileclient/betplay/kambi-bootstrap.js?cb=", // Certificación
  apiOperator: "http://localhost/services/operatorEndPoint.php?url=",
  apiOperatorKey: "localhost:3001",
  writeUsAPIUrl: "http://192.168.0.28:3004",
  oldOperator: "http://localhost/services/operatorEndPoint",
  apiResources: "http://localhost/services/resourceEndPoint.php?url=",
  apiPin: "http://localhost/services/pinwithdrawal.php",
  apiCompliance: "http://localhost/services/complianceEndPoint.php",
  reCatpchaKey: "6LdYhwwTAAAAAPBOcZwzDFAiSj8l2UCeRacP9HFK",
  validaPin: "http://localhost:80/services/validaPin.php?url=",
  apiCAUrl: "http://localhost:80/services/copaamerica.php",
  i18n: "http://localhost:80/i18n/es.json",
  dataUrl: "http://localhost:80/services/isVIP.php?url=",
  cuponURL: "http://localhost:80//services/cupon.php?url=",
  pokerURL: "https://betplay-test.esagaming.it/",
  messagingApiURLHablame: 'http://localhost:80/services/messagingCredentials.php?url=',
  messagingApiURLBlipBlip: 'http://localhost:80/services/messagingCredentialsBlip.php?url=',
  apiPayUNew:'https://sisplay.cemcolombia.co:31186',
  ip: 'https://api64.ipify.org?format=json'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
