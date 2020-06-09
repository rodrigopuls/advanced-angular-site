import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

// Meu Serviço Base
import { BaseService } from 'src/app/services/base.service';

// Meus Modelos
import { Fornecedor } from '../models/fornecedor';
import { CepConsulta } from '../models/cep-consulta';
import { Endereco } from '../models/endereco';

@Injectable()
export class FornecedorService extends BaseService {
  constructor(private http: HttpClient) {
        // Usado para acessar e chamar funções da abstração
    super();
  }

  obterTodos(): Observable<Fornecedor[]> {
    return this.http
      .get<Fornecedor[]>(this.ApiUrlBaseV1 + "fornecedores")
      .pipe(catchError(super.serviceError));
  }

  obterPorId(id: string): Observable<Fornecedor> {
    return this.http
      .get<Fornecedor>(this.ApiUrlBaseV1 + "fornecedores/" + id, super.getJsonAuthHeader())
      .pipe(catchError(super.serviceError));
  }

  novoFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http
      .post(this.ApiUrlBaseV1 + "fornecedores", fornecedor, this.getJsonAuthHeader())
      .pipe(
        map(super.extractData),
        catchError(super.serviceError)
      );
  }

  atualizarFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http
      .put(this.ApiUrlBaseV1 + "fornecedores/" + fornecedor.id, fornecedor, super.getJsonAuthHeader())
      .pipe(
        map(super.extractData),
        catchError(super.serviceError));
  }

  excluirFornecedor(id: string): Observable<Fornecedor> {
    return this.http
      .delete(this.ApiUrlBaseV1 + "fornecedores/" + id, super.getJsonAuthHeader())
      .pipe(
        map(super.extractData),
        catchError(super.serviceError));
  }

  atualizarEndereco(endereco: Endereco): Observable<Endereco> {
    return this.http
      .put(this.ApiUrlBaseV1 + "fornecedores/endereco/" + endereco.id, endereco, super.getJsonAuthHeader())
      .pipe(
        map(super.extractData),
        catchError(super.serviceError));
  }

  consultarCep(cep: string): Observable<CepConsulta> {
    return this.http
      .get<CepConsulta>(`https://viacep.com.br/ws/${cep}/json/`)
      .pipe(catchError(super.serviceError));
  }
}
