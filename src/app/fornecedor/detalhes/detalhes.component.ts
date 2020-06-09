// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Spinner
import { NgxSpinnerService } from 'ngx-spinner';

// Meus Componentes
import { Fornecedor } from '../models/fornecedor';


@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html'
})
export class DetalhesComponent implements OnInit {

  fornecedor: Fornecedor = new Fornecedor();

  constructor(
    private route: ActivatedRoute) {  }

  ngOnInit() {

    this.fornecedor = this.route.snapshot.data['fornecedor'];
  }
}
