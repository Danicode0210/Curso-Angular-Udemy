/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// import { CachingInterceptor } from './catch-errors';
import { InterceptorsInterceptor } from './interceptors';


/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
//   { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: InterceptorsInterceptor, multi: true },
];

