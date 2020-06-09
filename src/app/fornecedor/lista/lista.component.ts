// Angular
import { Component, OnInit } from '@angular/core';

// Spinner
import { NgxSpinnerService } from "ngx-spinner";

// Meus Códigos
import { FornecedorService } from '../services/fornecedor.service';
import { Fornecedor } from '../models/fornecedor';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html'
})
export class ListaComponent implements OnInit {

  public fornecedores: Fornecedor[];
  errorMessage: string;

  constructor(
    private fornecedorService: FornecedorService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {

    //  Spinner starts on init
    this.spinner.show();


    this.fornecedorService.obterTodos()
      .subscribe(
        fornecedores => this.fornecedores = fornecedores,
        error => this.errorMessage);

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 1000);
  }
}
