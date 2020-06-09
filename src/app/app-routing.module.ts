// Módulos do Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Meus Componentes
import { HomeComponent } from './navegacao/home/home.component';
import { NotFoundComponent } from './navegacao/not-found/not-found.component';
import { AcessoNegadoComponent } from './navegacao/acesso-negado/acesso-negado.component';


// Registrar rotas
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Vazio -> Home
  { path: 'home', component: HomeComponent }, // Rota Home
  {
    path: 'conta',
    loadChildren: () => import('./conta/conta.module')
      .then(m => m.ContaModule)
  }, // Rota Conta
  {
    path: 'fornecedores',
    loadChildren: () => import('./fornecedor/fornecedor.module')
      .then(m => m.FornecedorModule)
  }, // Rota Fornecedores
  {
    path: 'produtos',
    loadChildren: () => import('./produto/produto.module')
      .then(m => m.ProdutoModule)
  }, // Rota Produtos
  { path: 'acesso-negado', component: AcessoNegadoComponent }, // Rota 403
  { path: 'nao-encontrado', component: NotFoundComponent }, // Rota 404
  { path: '**', component: NotFoundComponent }, // Rota 404
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        useHash: false, // Não usar # na url
        enableTracing: false // Logar rotas
      })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
