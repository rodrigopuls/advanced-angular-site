// Angular
import { FormGroup, AbstractControl, Validators } from '@angular/forms';
import { ElementRef } from '@angular/core';

// Modelos
import { Fornecedor } from './models/fornecedor';
import { Endereco } from './models/endereco';

// Validação Brasil
import { MASKS, NgBrazilValidators } from 'ng-brazil';

// Abstração
import { FormBaseComponent } from '../base-components/form-base.component';
import { StringUtils } from '../utils/string-utils';
import { CepConsulta } from './models/cep-consulta';

// Services
import { FornecedorService } from './services/fornecedor.service';

export abstract class FornecedorBaseComponent extends FormBaseComponent {

  fornecedor: Fornecedor; // receber valor da view
  endereco: Endereco; // receber valor da view
  errors: any[] = []; // receber erros do backend
  errorsEndereco: any[] = []; // receber erros do backend
  fornecedorForm: FormGroup; // montar os elementos da view
  enderecoForm: FormGroup; // montar os elementos da view;

  // Poder usar Máscaras BR no Html
  MASKS = MASKS;

  // Usado qdo trocar o tipo de doc
  documentoPlaceholder: string = 'CPF (requerido)';

  constructor(protected fornecedorService: FornecedorService) {

    // Usado para acessar e chamar funções da abstração
    super();

    // Adicionar validações e mensagens para os elementos do form
    this.validationMessages = {
      nome: {
        required: 'Informe o Nome',
      },
      documento: {
        required: 'Informe o Documento',
        cpf: 'CPF em formato inválido',
        cnpj: 'CNPJ em formato inválido'
      },
      logradouro: {
        required: 'Informe o Logradouro',
      },
      numero: {
        required: 'Informe o Número',
      },
      bairro: {
        required: 'Informe o Bairro',
      },
      cep: {
        required: 'Informe o CEP',
        cep: 'CEP em formato inválido'
      },
      cidade: {
        required: 'Informe a Cidade',
      },
      estado: {
        required: 'Informe o Estado',
      }
    };


    // Instanciar as mensagens de validação
    super.configurarMensagensValidacaoBase(this.validationMessages);
  }


  protected configurarValidacaoFormulario(formInputElements: ElementRef[]) {
    // Implementa gatilhos para quando houver interações de foco

    // Quando o Tipo Fornecedor mudar
    this.tipoFornecedorForm().valueChanges.subscribe(() => {
      // Trocar a validação do documento
      this.trocarValidacaoDocumento();
      // Implementa gatilhos para quando houver interações de foco
      super.configurarValidacaoFormularioBase(formInputElements, this.fornecedorForm);
      // Validar o Form imediatamente
      super.validarFormulario(this.fornecedorForm);
    });

    // Implementa gatilhos para quando houver interações de foco
    super.configurarValidacaoFormularioBase(formInputElements, this.fornecedorForm);
  }

  // Mudar as validações com base no tipo de fornecedor
  protected trocarValidacaoDocumento() {

    // Limpar Validação
    this.documento().clearValidators();
    // Limpar mensagens de erro anteriores
    this.documento().setErrors(null)

    if (this.tipoFornecedorForm().value === '1') {
      // Adicionar Validação
      this.documento().setValidators([Validators.required, NgBrazilValidators.cpf])
      // Trocar Placeholder
      this.documentoPlaceholder = 'CPF (requerido)';
    }
    else {
      // Adicionar Validação
      this.documento().setValidators([Validators.required, NgBrazilValidators.cnpj])
      // Trocar Placeholder
      this.documentoPlaceholder = 'CNPJ (requerido)';
    }
  }

  // Retorna o controle 'tipoFornecedor' do html
  public tipoFornecedorForm(): AbstractControl {
    return this.fornecedorForm.get('tipoFornecedor');
  }

  // Retorna o controle 'documento' do html
  public documento(): AbstractControl {
    return this.fornecedorForm.get('documento');
  }


  public buscarCep(cep: string) {

    cep = StringUtils.onlyNumbers(cep);
    if (cep.length < 8) return;

    // Consumir o serviço de consulta
    this.fornecedorService.consultarCep(cep)
      .subscribe(
        sucesso => this.preencherEnderecoConsulta(sucesso), // Tratar Sucesso
        erro => this.errors.push(erro) // Tratar Erros
      );
  }

  protected preencherEnderecoConsulta(cepConsulta: CepConsulta): void {

    // Setar valores no form
    this.fornecedorForm.patchValue({
      endereco: {
        logradouro: cepConsulta.logradouro,
        bairro: cepConsulta.bairro,
        cep: cepConsulta.cep,
        cidade: cepConsulta.localidade,
        estado: cepConsulta.uf
      }
    })
  }
}
