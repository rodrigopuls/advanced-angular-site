// Angular
import { FormGroup } from '@angular/forms';
import { ElementRef } from '@angular/core';

// Modelos
import { Produto, Fornecedor } from './models/produto';

// Validação Brasil
import { MASKS } from 'ng-brazil';

// Abstração
import { FormBaseComponent } from '../base-components/form-base.component';


export abstract class ProdutoBaseComponent extends FormBaseComponent {

  produto: Produto; // receber valor da view
  fornecedores: Fornecedor[]; // receber valor da view
  errors: any[] = []; // receber erros do backend
  produtoForm: FormGroup; // montar os elementos da view

  // Poder usar Máscaras BR no Html
  MASKS = MASKS;

  constructor() {

    // Usado para acessar e chamar funções da abstração
    super();

    // Adicionar validações e mensagens para os elementos do form
    this.validationMessages = {
      fornecedorId: {
        required: 'Escolha um fornecedor',
      },
      nome: {
        required: 'Informe o Nome',
        minlength: 'Mínimo de 2 caracteres',
        maxlength: 'Máximo de 200 caracteres'
      },
      descricao: {
        required: 'Informe a Descrição',
        minlength: 'Mínimo de 2 caracteres',
        maxlength: 'Máximo de 1000 caracteres'
      },
      imagem: {
        required: 'Informe a Imagem',
      },
      valor: {
        required: 'Informe o Valor',
      }
    };

    // Instanciar as mensagens de validação
    super.configurarMensagensValidacaoBase(this.validationMessages);
  }

  protected configurarValidacaoFormulario(formInputElements: ElementRef[]) {
    // Implementa gatilhos para quando houver interações de foco
    super.configurarValidacaoFormularioBase(formInputElements, this.produtoForm);
  }
}
