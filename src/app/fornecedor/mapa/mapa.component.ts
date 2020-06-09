import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Endereco } from '../models/endereco';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { StringUtils } from 'src/app/utils/string-utils';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html'
})

export class MapaComponent implements OnInit {

  enderecoMap;

  // Recebe do Pai
  @Input() endereco: Endereco;

  constructor(
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();

    this.enderecoMap = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.google.com/maps/embed/v1/place?q=" + this.EnderecoCompleto() + "&key=" + environment.googleMapsKey);
  }

  esconderSpinner(iframeSrc: string) {
   if (!StringUtils.isNullOrEmpty(iframeSrc))
   {
      this.spinner.hide();
   }
  }

  public EnderecoCompleto(): string {
    return this.endereco.logradouro + ", " + this.endereco.numero + " - " + this.endereco.bairro + ", " + this.endereco.cidade + " - " + this.endereco.estado;
  }
}
