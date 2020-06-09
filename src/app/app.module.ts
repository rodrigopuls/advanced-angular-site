import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Localization
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt, 'pt');

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Toastr
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// Módulo de Roteamento
import { AppRoutingModule } from './app-routing.module';

// HttpClient e Http Interceptors
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Meu Error Interceptor
import { ErrorInterceptor } from './services/error.handler.service';

// Resolução de dependência do HTTP_INTERCEPTORS na classe ErrorInterceptor
// Passando a responsabilidade de Interceptors para o Error Interceptor
export const httpInterceptorsProviders = [
  {
    provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true
  }
];

// Componente Principal
import { AppComponent } from './app.component';

// Meus Módulos
import { NavegacaoModule } from './navegacao/navegacao.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, // Navegação
    AppRoutingModule, // Rotas Principais
    NavegacaoModule, // Módulo com conteúdo do site
    NgbModule, // Bootstrap
    BrowserAnimationsModule, // Animações
    ToastrModule.forRoot({
      timeOut: 2000,
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-bottom-left',
    }),
    HttpClientModule // Toastr
  ],
  providers:
  [
    httpInterceptorsProviders // Error Interceptor
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
