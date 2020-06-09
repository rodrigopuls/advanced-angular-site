import { HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { throwError } from 'rxjs';
import { LocalStorageUtils } from '../utils/localstorage';
import { environment } from 'src/environments/environment'; // Variáveis de ambiente


export abstract class BaseService {

  // LocalStorage
  public LocalStorage = new LocalStorageUtils();

  // Url Base da API
  protected ApiUrlBaseV1: string = environment.apiUrlBaseV1;

  // Adicionar Content-Type 'application/json' ao Post Header
  protected getJsonHeader() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
  }

  protected getJsonAuthHeader() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.LocalStorage.obterToken()}`
      })
    }
  }

  // Extrair Coleção Data da Resposta Recebida
  protected extractData(response: any) {
    return response.data || {};
  }

  // Extrair Erros no consumo do serviço
  // Se não for response, aceita qualquer coisa
  protected serviceError(response: Response | any) {

    // Coleção de string para erros desconhecidos não tratados
    let customError: string[] = [];

    if (response instanceof HttpErrorResponse) {

      if (response.statusText === "Unknown Error") {
        // Adicionar a mensagem quando o erro for desconhecido
        customError.push("Ocorreu um erro desconhecido");
        // Adicionar a lista de erros do serviço
        response.error.errors = customError;
      }

    }

    console.error(response);

    // Lançar o erro para ser tratado na observable
    return throwError(response);
  }

}
