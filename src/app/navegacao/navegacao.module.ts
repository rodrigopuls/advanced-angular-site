import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router"; // Módulo de Roteamento

// Meus Componentes
import { MenuComponent } from './menu/menu.component';
import { MenuLoginComponent } from './menu-login/menu-login.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AcessoNegadoComponent } from './acesso-negado/acesso-negado.component';

// Bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    // Declarar os componentes
    MenuComponent,
    MenuLoginComponent,
    HomeComponent,
    FooterComponent,
    NotFoundComponent,
    AcessoNegadoComponent
  ],
  imports: [
    // Importar os módulos
    CommonModule,
    RouterModule,
    NgbModule
  ],
  exports: [
    // Permitir que sejam acessados fora do módulo
    MenuComponent,
    MenuLoginComponent,
    HomeComponent,
    FooterComponent,
    NotFoundComponent,
    AcessoNegadoComponent
  ]
})

export class NavegacaoModule { }
