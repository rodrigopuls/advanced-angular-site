import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { BaseService } from 'src/app/services/base.service';
import { Produto, Fornecedor } from '../models/produto';

@Injectable()
export class ProdutoService extends BaseService {

    constructor(private http: HttpClient) { super() }

    obterTodos(): Observable<Produto[]> {
        return this.http
            .get<Produto[]>(this.ApiUrlBaseV1 + "produtos", super.getJsonAuthHeader())
            .pipe(catchError(super.serviceError));
    }

    obterPorId(id: string): Observable<Produto> {
        return this.http
            .get<Produto>(this.ApiUrlBaseV1 + "produtos/" + id, super.getJsonAuthHeader())
            .pipe(catchError(super.serviceError));
    }

    novoProduto(produto: Produto): Observable<Produto> {
        return this.http
            .post(this.ApiUrlBaseV1 + "produtos", produto, super.getJsonAuthHeader())
            .pipe(
                map(super.extractData),
                catchError(super.serviceError));
    }

    atualizarProduto(produto: Produto): Observable<Produto> {
        return this.http
            .put(this.ApiUrlBaseV1 + "produtos/" + produto.id, produto, super.getJsonAuthHeader())
            .pipe(
                map(super.extractData),
                catchError(super.serviceError));
    }

    excluirProduto(id: string): Observable<Produto> {
        return this.http
            .delete(this.ApiUrlBaseV1 + "produtos/" + id, super.getJsonAuthHeader())
            .pipe(
                map(super.extractData),
                catchError(super.serviceError));
    }

    obterFornecedores(): Observable<Fornecedor[]> {
        return this.http
            .get<Fornecedor[]>(this.ApiUrlBaseV1 + "fornecedores")
            .pipe(catchError(super.serviceError));
    }
}
