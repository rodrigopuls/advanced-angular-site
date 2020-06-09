// Angular
import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';

// Toastr
import { ToastrService } from 'ngx-toastr';

// ImageCropped
import { ImageCroppedEvent, ImageTransform, Dimensions } from 'ngx-image-cropper';

// Abstração do Form
import { ProdutoBaseComponent } from '../produto-form.base.component';

// Services, Utils, ...
import { ProdutoService } from '../services/produto.service';
import { CurrencyUtils } from 'src/app/utils/currency-utils';

@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html'
})
export class NovoComponent extends ProdutoBaseComponent implements OnInit {

  // ViewChildren disponibiliza elementos do DOM
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  // Propriedades do Component ImageCropped
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  imagemURL: string;
  imagemNome: string;

  constructor(private fb: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router,
    private toastr: ToastrService) {
          // Usado para acessar e chamar funções da abstração
          super();
    }

  ngOnInit(): void {

    this.produtoService.obterFornecedores()
      .subscribe(
        fornecedores => this.fornecedores = fornecedores);


    this.produtoForm = this.fb.group({
      fornecedorId: ['', [Validators.required]],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      descricao: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
      imagem: ['', [Validators.required]],
      valor: ['', [Validators.required]],
      ativo: [true]
    });
  }


  ngAfterViewInit(): void {
    // Instanciar as mensagens de validação
    super.configurarValidacaoFormulario(this.formInputElements);
  }

  adicionarProduto() {
    if (this.produtoForm.dirty && this.produtoForm.valid) {
      this.produto = Object.assign({}, this.produto, this.produtoForm.value);

      // Pegar só o base64 sem header
      this.produto.imagemUpload = this.croppedImage.split(',')[1];

      // Setar o nome da imagem
      this.produto.imagem = this.imagemNome;

      // API só aceita valores em decimal
      this.produto.valor = CurrencyUtils.StringParaDecimal(this.produto.valor);

      this.produtoService.novoProduto(this.produto)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso) },
          falha => { this.processarFalha(falha) }
        );

      this.mudancasNaoSalvas = false;
    }
  }

  processarSucesso(response: any) {
    this.produtoForm.reset();
    this.errors = [];

    let toast = this.toastr.success('Produto cadastrado com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/produtos/listar-todos']);
      });
    }
  }

  processarFalha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }

  //Image Cropped

  fileChangeEvent(event: any): void {
    // O que será feito quando alterar o valor da imagem
    this.imageChangedEvent = event;
    this.imagemNome = event.currentTarget.files[0].name;
  }

  imageCropped(event: ImageCroppedEvent) {
    // Assim que recortar, recebe a base64 da imagem
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    // Quando a imagem for carregada, exibir cropper
    this.showCropper = true;
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    // Quando o cropper estiver pronto
    console.log('Cropper ready!', sourceImageDimensions)
  }

  loadImageFailed() {
    // Falha no cropper
    this.errors.push('O formato do arquivo ' + this.imagemNome + ' não é aceito.')
  }
}

