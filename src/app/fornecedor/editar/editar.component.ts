// Angular
import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// Validação Brasil
import { NgBrazilValidators, MASKS } from 'ng-brazil';

// Toastr
import { ToastrService } from 'ngx-toastr';

// Spinner
import { NgxSpinnerService } from "ngx-spinner";

// Bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Minha Lógica
import { StringUtils } from 'src/app/utils/string-utils';
import { FornecedorService } from '../services/fornecedor.service';

// models
import { Endereco } from '../models/endereco';

// Abstração do Form
import { FornecedorBaseComponent } from '../fornecedor-form.base.component';


@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html'
})

export class EditarComponent extends FornecedorBaseComponent implements OnInit {

  // ViewChildren disponibiliza elementos do DOM
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  // Usado para identificar e alertar o tipo de documento
  tipoFornecedor: number;
  documentoPlaceholder: string = '';

  // Poder usar Máscaras BR no Html
  MASKS = MASKS;

  constructor(private fb: FormBuilder,
    protected fornecedorService: FornecedorService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService) {

    // Usado para acessar e chamar funções da abstração
    super(fornecedorService);

    // Obter dados no resolve da rota
    this.fornecedor = this.route.snapshot.data['fornecedor'];
    this.tipoFornecedor = this.fornecedor.tipoFornecedor;
  }

  ngOnInit() {

    //  Spinner starts on init
    this.spinner.show();

    // Criar o grupo de elementos
    this.fornecedorForm = this.fb.group({
      id: '',
      nome: ['', [Validators.required]],
      documento: '',
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]]
    });

    // Criar o grupo de elementos
    this.enderecoForm = this.fb.group({
      id: '',
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
      bairro: ['', [Validators.required]],
      cep: ['', [Validators.required, NgBrazilValidators.cep]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      fornecedorId: ''
    });

    // Popular Form na ativação
    this.preencherForm();

    setTimeout(() => {
      /** spinner ends after 1 seconds */
      this.spinner.hide();
    }, 1000);
  }

  preencherForm() {

    // Setar valores no form
    this.fornecedorForm.patchValue({
      id: this.fornecedor.id,
      nome: this.fornecedor.nome,
      ativo: this.fornecedor.ativo,
      tipoFornecedor: this.fornecedor.tipoFornecedor.toString(),
      documento: this.fornecedor.documento
    });

    if (this.tipoFornecedorForm().value === "1") {
      this.documento().setValidators([Validators.required, NgBrazilValidators.cpf]);
    }
    else {
      this.documento().setValidators([Validators.required, NgBrazilValidators.cnpj]);
    }

    this.enderecoForm.patchValue({
      id: this.fornecedor.endereco.id,
      logradouro: this.fornecedor.endereco.logradouro,
      numero: this.fornecedor.endereco.numero,
      complemento: this.fornecedor.endereco.complemento,
      bairro: this.fornecedor.endereco.bairro,
      cep: this.fornecedor.endereco.cep,
      cidade: this.fornecedor.endereco.cidade,
      estado: this.fornecedor.endereco.estado
    });
  }

  ngAfterViewInit() {
    // Quando o Tipo Fornecedor mudar
    super.tipoFornecedorForm().valueChanges.subscribe(() => {
      // Trocar a validação do documento
      super.trocarValidacaoDocumento();
      // Implementa gatilhos para quando houver interações de foco
      super.configurarValidacaoFormularioBase(this.formInputElements, this.fornecedorForm);
      // Validar o Form imediatamente
      super.validarFormulario(this.fornecedorForm);
    });

    // Implementa gatilhos para quando houver interações de foco
    super.configurarValidacaoFormularioBase(this.formInputElements, this.fornecedorForm);
  }

  editarFornecedor() {
    // Validar o Formulário
    if (this.fornecedorForm.dirty && this.fornecedorForm.valid) {

      // Mapear o fornecedor com os dados do formulário
      this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm.value);

      // Tratar dados
      this.fornecedor.documento = StringUtils.onlyNumbers(this.fornecedor.documento);
      this.fornecedor.endereco.cep = StringUtils.onlyNumbers(this.fornecedor.endereco.cep);
      this.fornecedor.tipoFornecedor = Number(this.fornecedor.tipoFornecedor);

      // Chamar a Observable no Serviço e inscrever para a resposta
      this.fornecedorService.atualizarFornecedor(this.fornecedor)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso) }, // Tratar Sucesso
          falha => { this.processarFalha(falha) } // Tratar Falha
        );
    }
  }

  processarSucesso(response: any) {
    // Zerar o form
    this.fornecedorForm.reset();
    // Zerar erros
    this.errors = [];

    // Limpar pois Mudanças foram salvas
    this.mudancasNaoSalvas = false;

    // Toastr com sucesso
    let toast = this.toastr.success('Fornecedor atualizado com sucesso!', 'Sucesso!');
    if (toast) {
      // Aguardar o toastr e redirecionar
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/fornecedores/listar-todos']);
      });
    }
  }

  processarFalha(falha: any) {
    // Carregar erros para a interpolation na view
    this.errors = falha.error.errors;

    // Toastr com erro
    this.toastr.error('Ocorreu um erro!', 'Ooops :(');
  }

  //REGION ENDEREÇO

  editarEndereco() {
    if (this.enderecoForm.dirty && this.enderecoForm.valid) {

      this.endereco = Object.assign({}, this.endereco, this.enderecoForm.value);

      this.endereco.cep = StringUtils.onlyNumbers(this.endereco.cep);
      this.endereco.fornecedorId = this.fornecedor.id;

      // Chamar a Observable no Serviço e inscrever para a resposta
      this.fornecedorService.atualizarEndereco(this.endereco)
        .subscribe(
          () => { this.processarSucessoEndereco(this.endereco) }, // Tratar Sucesso
          falha => { this.processarFalhaEndereco(falha) } // Tratar Falha
        );
    }

  }

  processarSucessoEndereco(endereco: Endereco) {
    // Zerar erros
    this.errors = [];

    // Limpar pois Mudanças foram salvas
    this.mudancasNaoSalvas = false;

    // Toastr com sucesso
    this.toastr.success('Endereço atualizado com sucesso!', 'Sucesso!');
    this.fornecedor.endereco = endereco
    this.modalService.dismissAll();
  }

  processarFalhaEndereco(fail: any) {
    this.errorsEndereco = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Ops :(');
  }

  // Criar Modal com o conteudo do #localizador
  abrirModal(content) {
    this.modalService.open(content);
  }

}
