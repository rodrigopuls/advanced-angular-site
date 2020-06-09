// Componente Angular
import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, CanDeactivate } from '@angular/router';

// Guard Abstrato
import { BaseGuard } from 'src/app/services/base.guard';

// Meus Componentes
import { NovoComponent } from '../novo/novo.component';

@Injectable()
export class FornecedorGuard extends BaseGuard implements CanActivate, CanDeactivate<NovoComponent> {

  constructor(protected router: Router) {
        // Usado para acessar e chamar funções da abstração
    super(router);
  }

  canDeactivate(component: NovoComponent) {
    if (component.mudancasNaoSalvas) {
      return window.confirm('Tem certeza que deseja abandonar o preenchimento do formulario?');
    }
    return true
  }

  canActivate(routeAc: ActivatedRouteSnapshot) {
    return super.validarClaims(routeAc);
  }
}
