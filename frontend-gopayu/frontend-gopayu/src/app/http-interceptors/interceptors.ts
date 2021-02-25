import { Injectable, Inject } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { MatSnackBar } from "@angular/material";
import { PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { ConfigService } from "../services/config.service";
import { environment } from "../../environments/environment";

@Injectable()
export class InterceptorsInterceptor implements HttpInterceptor {
  private isBrowser: boolean;
  private Authorization: any;
  private userName: string;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private snackBar: MatSnackBar,
    private config: ConfigService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      if (localStorage.getItem("session")) {
        var session = JSON.parse(localStorage.getItem("session"));
        this.Authorization = session.accessToken;
      }
    }
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    var regex = new RegExp(`${environment.apiOperatorKey}`.replace(/[.*+\-?^${}()|[\]\\]/g,'\\$&'));
    //Add header
    if (regex.test(request.url) || /compliance/.test(request.url) || /operator/.test(request.url)) {
      
      if (/accounts\/sessions/.test(request.url)) {
        let body = JSON.parse(request.body);
        this.userName = body.userName;

        request = request.clone({
          setHeaders: {
            "X-Custom-Version": environment.v,
            "X-Custom-Header": body.userName,
            "Content-Type": "application/json; charset=utf-8",
            "X-Sisplay-Header": "true"
          },
        });
      } else if (
        /accept-terms/.test(request.url)
      ) {
        request = request.clone({
          setHeaders: {
            "X-Custom-Version": environment.v,
            "Content-Type": "application/json; charset=utf-8"
          },
        });
      } 
      else if (/transferwithdrawal/.test(request.url)) {
        request = request.clone({
          setHeaders: {
            "X-Custom-Version": environment.v,
            "X-Sisplay-Header": "true"
          },
        });
      }
      else if (this.userName) {
        request = request.clone({
          setHeaders: {
            "X-Custom-Version": environment.v,
            "X-Custom-Header": this.userName,
            "Content-Type": "application/json; charset=utf-8",
          },
        });
      } else {
        request = request.clone({
          setHeaders: {
            "X-Custom-Version": environment.v,
            "Content-Type": "application/json; charset=utf-8",
          },
        });
      }
      
      if (this.Authorization) {
        var session = JSON.parse(localStorage.getItem("session"));
        var profile = JSON.parse(localStorage.getItem("profile"));

        request = request.clone({
          setHeaders: {
            Authorization: session.accessToken,
            "X-Custom-Header": profile.username,
            "X-Custom-Times":
              new Date().getTime() +
              ", " +
              session.expiresIn +
              ", " +
              session.maxAge,
          },
        });
      }
    } else if (/pinwithdrawal/.test(request.url)) {
      request = request.clone({
        setHeaders: {
          "X-Sisplay-Header": "true",
        },
      });

    }

    return next.handle(request).pipe(
      (data) => data,
      catchError((err: any) => {
        if (
          regex.test(request.url) &&
          localStorage.getItem("session") &&
          (err.status == 401)
        ) {
          localStorage.clear();
          window.location.href = "/";
        }
        else if (err.status == 406)
        {
          this.snackBar.open(
            "Hubo un error, por favor intenta de nuevo",
            "Cerrar",
            {
              duration: 10000,
            }
          );
        }
        else if (err.status == 505) {
          this.snackBar.open(
            "Tienes una versión desactualizada, la página será actualizada en 3 segundos...",
            "Cerrar",
            {
              duration: 3000,
            }
          );
          setTimeout(() => {
            localStorage.clear();
            window.location.href = "/inicio";
            window.location.reload();
          }, 3000);
        } else if (err.status == 409) {
          this.snackBar.open(
            "Usted presenta un retraso de tiempo para procesar su solicitud, la pagina será refrescada para sincronizarlo nuevamente...",
            "Cerrar",
            {
              duration: 3000,
            }
          );
          setTimeout(() => {
            localStorage.clear();
            window.location.href = "/inicio";
            window.location.reload();
          }, 3000);
        } else if (err.status == 418) {
          this.snackBar.open(
            "Betplay no está disponible en tu ubicación",
            "Cerrar",
            {
              duration: 3000,
            }
          );
        }

        // var response = this.config.handleError(err);
        throw err;
      })
    );
  }
}

/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
