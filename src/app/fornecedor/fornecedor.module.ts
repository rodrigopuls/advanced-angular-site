// Módulos Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

//Spinner
import { NgxSpinnerModule } from "ngx-spinner";

// Validação Brasil e Mask
import { NgBrazil } from 'ng-brazil'
import { TextMaskModule } from 'angular2-text-mask';

// Meus Serviços
import { FornecedorService } from './services/fornecedor.service';

// Minhas Rotas
import { FornecedorRoutingModule } from './fornecedor.route';

// Meus Componentes
import { FornecedorAppComponent } from './fornecedor.app.component';
import { NovoComponent } from './novo/novo.component';
import { EditarComponent } from './editar/editar.component';
import { ExcluirComponent } from './excluir/excluir.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { ListaComponent } from './lista/lista.component';
import { MapaComponent } from './mapa/mapa.component';
import { ListaProdutosComponent } from './produtos/lista-produtos.component';

// Meus Resolvers
import { FornecedorResolve } from './services/fornecedor.resolve';

// Minhas Guards
import { FornecedorGuard } from './services/fornecedor.guard';

@NgModule({
  declarations: [
    FornecedorAppComponent,
    NovoComponent,
    ListaComponent,
    EditarComponent,
    ExcluirComponent,
    DetalhesComponent,
    MapaComponent,
    ListaProdutosComponent
  ],
  imports: [
    CommonModule,
    FornecedorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule, // Máscaras
    NgBrazil, // Validação Brasil
    NgxSpinnerModule // Spinner
  ],
  providers: [
    FornecedorService,
    FornecedorResolve,
    FornecedorGuard
  ]
})
export class FornecedorModule { }
