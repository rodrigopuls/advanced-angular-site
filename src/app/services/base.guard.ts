import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { LocalStorageUtils } from 'src/app/utils/localstorage';

// Abstract - Não pode ser instanciada, só herdada
export abstract class BaseGuard {

  // Acessar o LocalStorage
  private localStorageUtils = new LocalStorageUtils();

  // Injetar a rota
  constructor(protected router: Router) { }

  // Validar Claims das rotas
  protected validarClaims(routeAc: ActivatedRouteSnapshot): boolean {

    // Redirecione se não estiver logado
    // Informe a url de retorno
    if (!this.localStorageUtils.obterToken()) {
      this.router.navigate(
        ['/conta/login/'],
        {
          queryParams:
          {
            returnUrl: this.router.url
          }
        });
    }

    // Obtém usuário no localstorage
    let user = this.localStorageUtils.obterUsuario();

    // Obtém dados no data da rota
    let data: any = routeAc.data[0];

    // Rota tem checagem de Claim?
    if (data !== undefined) {

      // Obtém claim nos dados
      let claim = routeAc.data[0]['claim'];

      if (claim) {

        // Se não tiver qualquer claim, negar imediatamente
        if (!user.claims) {
          this.navegarAcessoNegado();
        }

        // Checar se o user tem a claim da rota
        let userClaims = user.claims.find(x => x.type === claim.nome);

        if (!userClaims) {
          this.navegarAcessoNegado();
        }

        // Checar se o user pode realizar a ação na claim (Adicionar, Atualizar e Excluir)
        let acoesPermitidasClaim = userClaims.value as string;

        if (!acoesPermitidasClaim.includes(claim.acao)) {
          this.navegarAcessoNegado();
        }
      }
    }

    // Pode acessar
    return true;
  }

  private navegarAcessoNegado() {
    this.router.navigate(['/acesso-negado']);
  }
}
