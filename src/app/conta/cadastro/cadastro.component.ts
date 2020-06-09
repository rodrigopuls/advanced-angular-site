// Componentes Angular
import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormControlName } from '@angular/forms'; // Formulário e Validação
import { Router } from '@angular/router';
import { CustomValidators } from 'ngx-custom-validators'; // Pacote de Validação
import { ToastrService } from 'ngx-toastr'; // Toastr

// Meu "Modelo"
import { Usuario } from '../models/usuario';

// Meu Serviço
import { ContaService } from '../services/conta.service';

// Abstração da Validação
import { FormBaseComponent } from 'src/app/base-components/form-base.component';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html'
})

export class CadastroComponent extends FormBaseComponent implements OnInit, AfterViewInit {


  // ViewChildren disponibiliza elementos do DOM
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  errors: any[] = []; // receber erros do backend
  cadastroForm: FormGroup; // montar os elementos da view
  usuario: Usuario; // receber valor da view

  constructor(
    private fb: FormBuilder,
    private contaService: ContaService,
    private route: Router,
    private toastr: ToastrService) {

    // Usado para acessar e chamar funções da abstração
    super();

    // Adicionar validações e mensagens para os elementos do form
    this.validationMessages = {
      email: {
        required: 'Informe o e-mail',
        email: 'Email inválido'
      },
      password: {
        required: 'Informe a senha',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
      },
      confirmPassword: {
        required: 'Informe a senha novamente',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres',
        equalTo: 'As senhas não conferem'
      }
    };

    // Instanciar as mensagens de validação
    super.configurarMensagensValidacaoBase(this.validationMessages);
  }


  ngOnInit(): void {
    // A comparação de senhas tem que ser feita fora do grupo
    let password = new FormControl('', [Validators.required, CustomValidators.rangeLength([6, 15])]);
    let confirmPassword = new FormControl('', [Validators.required, CustomValidators.rangeLength([6, 15]), CustomValidators.equalTo(password)]);

    // Criar o grupo de elementos
    this.cadastroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: password,
      confirmPassword: confirmPassword
    });
  }

  ngAfterViewInit(): void {
    // Implementa gatilhos para quando houver interações de foco
    super.configurarValidacaoFormularioBase(this.formInputElements, this.cadastroForm);
  }

  adicionarConta() {
    // Validar o Formulário
    if (this.cadastroForm.dirty && this.cadastroForm.valid) {

      // Mapear o usuario com os dados do formulário
      this.usuario = Object.assign({}, this.usuario, this.cadastroForm.value);

      // Chamar a Observable no Serviço e inscrever para a resposta
      this.contaService.cadastrarUsuario(this.usuario)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso) }, // Tratar Sucesso
          falha => { this.processarFalha(falha) } // Tratar Falha
        );
    }
  }

  processarSucesso(sucesso: any) {
    // Zerar o form
    this.cadastroForm.reset();
    // Zerar os erros
    this.errors = [];
    // Salvar os dados do Usuário Localmente
    this.contaService.LocalStorage.salvarDadosLocaisUsuario(sucesso);

    // Limpar pois Mudanças foram salvas
    this.mudancasNaoSalvas = false;

    // Toastr com sucesso
    let toast = this.toastr.success('Cadastro realizado com sucesso', 'Bem Vindo!');
    if (toast) {
      // Aguardar o toastr e redirecionar
      toast.onHidden.subscribe(() => {
        this.route.navigate(['/home']);
      });
    }
  }

  processarFalha(falha: any) {
    // Carregar erros para a interpolation na view
    this.errors = falha.error.errors;

    // Toastr com erro
    this.toastr.error('Ocorreu um erro!', 'Ops :(');
  }

}
