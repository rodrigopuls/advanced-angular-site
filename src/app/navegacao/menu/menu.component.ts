import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent {

  // Funcionar o menu hamburguer
  public isCollapsed: boolean;

  constructor() {
    this.isCollapsed = true;
  }
}
