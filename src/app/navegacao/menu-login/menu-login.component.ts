import { Component } from "@angular/core";
import { LocalStorageUtils } from 'src/app/utils/localstorage';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu-login',
  templateUrl: './menu-login.component.html'
})

export class MenuLoginComponent {

  // Acessar o localstorage
  localStorageUtils = new LocalStorageUtils();

  // Coletar dados do usuário no localstorage
  token: string = "";
  user: any;

  // Disponibilizar o email na view
  email: string = "";

  constructor(private router: Router) { }

  usuarioLogado(): boolean {

    // Consulta os dados no localstorage
    this.token = this.localStorageUtils.obterToken();
    this.user = this.localStorageUtils.obterUsuario();

    // Se existir atribuir email
    if (this.user) {
      this.email = this.user.email
    }

    // Se o token for diferente de nulo, retornar true
    return this.token !== null;
  }

  logout() {
    // Limpar dados e redirecionar
    this.localStorageUtils.limparDadosLocaisUsuario();
    this.router.navigate(['/home']);
  }
}
