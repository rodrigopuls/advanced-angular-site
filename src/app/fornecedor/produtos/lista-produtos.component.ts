import { Component, Input } from '@angular/core';
import { Produto } from 'src/app/produto/models/produto';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'lista-produto',
  templateUrl: './lista-produtos.component.html'
})
export class ListaProdutosComponent {

  imagensUrlBase: string = environment.imagensUrlBase;

  // Vai alimentar o component através do Input
  // Receberá a lista de produto
  @Input()
  produtos: Produto[];
}
