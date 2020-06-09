// Componentes Angular
import { Component, OnInit, ElementRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms'; // Formulário e Validação
import { Router, ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'ngx-custom-validators'; // Pacote de Validação
import { ToastrService } from 'ngx-toastr'; // Toastr

// Meu "Modelo"
import { Usuario } from '../models/usuario';

// Meu Serviço
import { ContaService } from '../services/conta.service';

// Abstração da Validação
import { FormBaseComponent } from 'src/app/base-components/form-base.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent extends FormBaseComponent implements OnInit {

  // ViewChildren disponibiliza elementos do DOM
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  errors: any[] = []; // receber erros do backend
  loginForm: FormGroup; // montar os elementos da view
  usuario: Usuario; // receber valor da view

  returnUrl: string; // usado para redirecionar pós login

  constructor(
    private fb: FormBuilder,
    private contaService: ContaService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService) {

    // Usado para acessar e chamar funções da abstração
    super();

    // Adicionar os elementos do formulário e suas validações
    this.validationMessages = {
      email: {
        required: 'Informe o e-mail',
        email: 'Email inválido'
      },
      password: {
        required: 'Informe a senha',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
      }
    };

    // Captura o returnUrl na rota
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];

    // Instanciar as mensagens de validação
    super.configurarMensagensValidacaoBase(this.validationMessages);
  }


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]],
    });
  }

  ngAfterViewInit(): void {
    // Implementa gatilhos para quando houver interações de foco
    super.configurarValidacaoFormularioBase(this.formInputElements, this.loginForm);
  }

  login() {
    // Validar o Formulário
    if (this.loginForm.dirty && this.loginForm.valid) {

      // Mapear o usuario com os dados do formulário
      this.usuario = Object.assign({}, this.usuario, this.loginForm.value);

      // Chamar a Observable no Serviço e inscrever para a resposta
      this.contaService.login(this.usuario)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso) }, // Tratar Sucesso
          falha => { this.processarFalha(falha) } // Tratar Falha
        );
    }
  }

  processarSucesso(sucesso: any) {
    // Zerar o form
    this.loginForm.reset();
    // Zerar os erros
    this.errors = [];
    // Salvar os dados do Usuário Localmente
    this.contaService.LocalStorage.salvarDadosLocaisUsuario(sucesso);

    // Toastr com sucesso
    let toast = this.toastr.success('Login realizado com sucesso', 'Bem Vindo!',
      {
        timeOut: 1000
      });
    if (toast) {
      toast.onHidden.subscribe(() => {
        // Redirecionar
        this.returnUrl
          ? this.router.navigate([this.returnUrl])
          : this.router.navigate(['/home']);
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
