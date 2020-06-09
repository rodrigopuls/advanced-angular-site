// Componente Angular
import { Injectable } from "@angular/core";
import { CanDeactivate, CanActivate, Router } from '@angular/router';
import { LocalStorageUtils } from 'src/app/utils/localstorage';

// Meu componente
import { CadastroComponent } from '../cadastro/cadastro.component';

@Injectable()
export class ContaGuard implements CanDeactivate<CadastroComponent>, CanActivate {

  // Acessar o LocalStorage
  localStorageUtils = new LocalStorageUtils();

constructor(private router: Router){}

  canDeactivate(component: CadastroComponent) {
    // Descobre se alterei o estado do componente e não salvei
    if (component.mudancasNaoSalvas) {
      // Alertar caso sim e esteja saindo
      return window.confirm("Tem certeza que deseja abandonar o preenchimento do formulário?");
    }

    // Pode Sair
    return true;
  }

  canActivate() {
    if (this.localStorageUtils.obterToken()) {
      // Redireciona se já estiver logado
      this.router.navigate(['/home']);
    }

    // Pode acessar
    return true;
  }
}
