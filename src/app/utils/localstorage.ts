export class LocalStorageUtils {

  // Encaminhar a resposta para os métodos específicos
  public salvarDadosLocaisUsuario(response: any) {
    this.salvarToken(response.accessToken);
    this.salvarUsuario(response.userToken);
  }

  // Limpar dados locais
  public limparDadosLocaisUsuario() {
    localStorage.removeItem('rpulsng.token');
    localStorage.removeItem('rpulsng.user');
  }

  // Recebe o token e salvar localmente
  public salvarToken(token: string) {
    return localStorage.setItem('rpulsng.token', token);
  }

  // Recebe o usuário e salvar localmente
  public salvarUsuario(user: string) {
    return localStorage.setItem('rpulsng.user', JSON.stringify(user));
  }

  // Consultar token salvo localmente
  public obterToken(): string {
    return localStorage.getItem('rpulsng.token');
  }

  // Consultar token salvo localmente
  public obterUsuario() {
    return JSON.parse(localStorage.getItem('rpulsng.user'));
  }
}
