// Angular
import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';

// Toastr
import { ToastrService } from 'ngx-toastr';

// Abstração do Form
import { FornecedorBaseComponent } from '../fornecedor-form.base.component';

// Validação Brasil
import { NgBrazilValidators } from 'ng-brazil';

// Minha Lógica
import { FornecedorService } from '../services/fornecedor.service';
import { StringUtils } from 'src/app/utils/string-utils';

@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html'
})

export class NovoComponent extends FornecedorBaseComponent implements OnInit {

  // ViewChildren disponibiliza elementos do DOM
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  constructor(private fb: FormBuilder,
    protected fornecedorService: FornecedorService,
    private router: Router,
    private toastr: ToastrService) {

    // Usado para acessar e chamar funções da abstração
    super(fornecedorService);
  }

  ngOnInit() {

    // Criar o grupo de elementos
    this.fornecedorForm = this.fb.group({
      nome: ['', [Validators.required]],
      documento: ['', [Validators.required, NgBrazilValidators.cpf]],
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]],

      endereco: this.fb.group({
        logradouro: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        complemento: [''],
        bairro: ['', [Validators.required]],
        cep: ['', [Validators.required, NgBrazilValidators.cep]],
        cidade: ['', [Validators.required]],
        estado: ['', [Validators.required]]
      })

    });

    // Setar valores no form
    this.fornecedorForm.patchValue({
      tipoFornecedor: '1',
      ativo: true
    })
  }

  // A lifecycle hook that is called after Angular has fully initialized a component's view
  ngAfterViewInit(): void {
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


  adicionarFornecedor() {

    // Validar o Formulário
    if (this.fornecedorForm.dirty && this.fornecedorForm.valid) {

      // Mapear o fornecedor com os dados do formulário
      this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm.value);

      // Tratar dados
      this.fornecedor.documento = StringUtils.onlyNumbers(this.fornecedor.documento);
      this.fornecedor.endereco.cep = StringUtils.onlyNumbers(this.fornecedor.endereco.cep);
      this.fornecedor.tipoFornecedor = Number(this.fornecedor.tipoFornecedor);

      // Chamar a Observable no Serviço e inscrever para a resposta
      this.fornecedorService.novoFornecedor(this.fornecedor)
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
    let toast = this.toastr.success('Fornecedor cadastrado com sucesso!', 'Sucesso!');
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
}
