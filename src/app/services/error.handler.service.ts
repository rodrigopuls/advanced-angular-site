// Angular
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

// RXJS
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Meu Storage Local
import { LocalStorageUtils } from '../utils/localstorage';


// https://angular.io/api/common/http/HttpInterceptor
// Intercepts and handles an HttpRequest or HttpResponse.

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  localStorageUtils = new LocalStorageUtils();

  // req - HttpRequest
  // next - Handler tipo "pipeline/middleware"
  // retorna um Observable Http de qualquer tipo

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Interceptar a requisição e processar somento os erros
    return next.handle(req)
      .pipe(
        catchError(
          error => {
            // Se o erro é uma instância de HttpErrorResponse
            if (error instanceof HttpErrorResponse) {

              // 401 Unauthorized
              if (error.status === 401) {
                this.localStorageUtils.limparDadosLocaisUsuario();

                // Redireciona para login e depois retorna para o acesso inicial
                this.router.navigate(
                  ['/conta/login'],
                  {
                    queryParams: {
                      returnUrl: this.router.url
                    }
                  });
              }

              //403 Forbidden
              if (error.status === 403) {
                this.router.navigate(['/acesso-negado']);
              }
            }

            return throwError(error);
          }
        ));
  }

}
