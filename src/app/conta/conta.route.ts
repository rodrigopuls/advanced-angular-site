// Componentes Angular
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

// Meus Componentes
import { ContaAppComponent } from './conta.app.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { LoginComponent } from './login/login.component';

// Minha Guarda de Rota
import { ContaGuard } from './services/conta.guard';


// Registrar rotas
const contaRouterConfig: Routes = [
  {
    path: '', component: ContaAppComponent, // Rota vazia
    children: [
      {
        path: 'cadastro',
        component: CadastroComponent,
        canActivate: [ContaGuard], // Pode Abrir
        canDeactivate: [ContaGuard] // Pode Sair?
      }, // Rota cadastro com Guarda
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [ContaGuard] // Pode Abrir
       } // Rota login
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(contaRouterConfig)
  ],
  exports: [RouterModule]
})

export class ContaRoutingModule { }
