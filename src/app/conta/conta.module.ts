// Módulos do Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Rota
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Formulário
import { HttpClientModule } from '@angular/common/http';
import { CustomFormsModule } from 'ngx-custom-validators'; // Pacote de Validação


// Meus Componentes
import { ContaAppComponent } from './conta.app.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { LoginComponent } from './login/login.component';

// Meu Módulo de Rotas
import { ContaRoutingModule } from './conta.route';

// Meu Serviço
import { ContaService } from './services/conta.service';

// Minha Guarda de Rota
import { ContaGuard } from './services/conta.guard';


@NgModule({
  declarations: [
    ContaAppComponent, // Componente que só roteia os demais
    CadastroComponent, // Cadastro
    LoginComponent, // Login
  ],
  imports: [
    CommonModule, // Common
    RouterModule, // Rota
    ContaRoutingModule, // Meu Módulo de Rotas
    FormsModule, // Formulário
    ReactiveFormsModule, // Formulários Ricos
    HttpClientModule, // Cliente Http
    CustomFormsModule // Validação de Form Customizado
  ],
  providers: [
    ContaService, // Meu Serviço de Conta
    ContaGuard // Minha Guarde de Rota
  ]
})
export class ContaModule { }
