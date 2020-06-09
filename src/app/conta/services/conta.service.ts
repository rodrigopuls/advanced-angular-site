// Módulos Angular
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Meu Serviço
import { BaseService } from 'src/app/services/base.service';

// Minha Interface
import { Usuario } from '../models/usuario';


@Injectable()

export class ContaService extends BaseService {
  constructor(private http: HttpClient) {
    // Usado para acessar e chamar funções da abstração
    super();
  }

  // Método envia um post e responde com uma Observable
  cadastrarUsuario(usuario: Usuario): Observable<Usuario> {

    // Post
    let response = this.http
      .post(this.ApiUrlBaseV1 + 'nova-conta', usuario, this.getJsonHeader())
      .pipe(
        map(this.extractData), // Mapear o resultado
        catchError(this.serviceError)); // Trabalhar o erro

    return response;

  }

  login(usuario: Usuario): Observable<Usuario> {

    // Post
    let response = this.http
      .post(this.ApiUrlBaseV1 + 'entrar', usuario, this.getJsonHeader())
      .pipe(
        map(this.extractData), // Mapear o resultado
        catchError(this.serviceError)); // Trabalhar o erro

    return response;

  }
}
