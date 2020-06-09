// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Meus Componentes
import { FornecedorAppComponent } from './fornecedor.app.component';
import { NovoComponent } from './novo/novo.component';
import { ListaComponent } from './lista/lista.component';
import { EditarComponent } from './editar/editar.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { ExcluirComponent } from './excluir/excluir.component';

// Meu Resolver
import { FornecedorResolve } from './services/fornecedor.resolve';

// Meu Guard
import { FornecedorGuard } from './services/fornecedor.guard';

const fornecedorRouterConfig: Routes = [
  {
    path: '', component: FornecedorAppComponent,
    children: [
      {
        path: 'listar-todos',
        component: ListaComponent
      },
      {
        path: 'detalhes/:id',
        component: DetalhesComponent,
        resolve: { // Resolve uma classe e disponibiliza o dado na rota
          fornecedor: FornecedorResolve
        }
      },
      {
        path: 'adicionar-novo',
        component: NovoComponent,
        canDeactivate: [FornecedorGuard],
        canActivate: [FornecedorGuard],
        data: [
          { // Cria um objeto 'claim' e disponibiliza para a rota
            claim: { nome: 'Fornecedor', acao: 'Adicionar' }
          }
        ]
      },
      {
        path: 'editar/:id',
        component: EditarComponent,
        canActivate: [FornecedorGuard],
        data: [
          { // Cria um objeto 'claim' e disponibiliza para a rota
            claim: { nome: 'Fornecedor', acao: 'Atualizar' }
          }
        ],
        resolve: { // Resolve uma classe e disponibiliza o dado na rota
          fornecedor: FornecedorResolve
        }
      },
      {
        path: 'excluir/:id',
        component: ExcluirComponent,
        canActivate: [FornecedorGuard],
        data: [
          { // Cria um objeto 'claim' e disponibiliza para a rota
            claim: { nome: 'Fornecedor', acao: 'Excluir' }
          }
        ],
        resolve: { // Resolve uma classe e disponibiliza o dado na rota
          fornecedor: FornecedorResolve
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(fornecedorRouterConfig)
  ],
  exports: [RouterModule]
})
export class FornecedorRoutingModule { }
