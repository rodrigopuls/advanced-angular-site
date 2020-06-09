import { ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, fromEvent, merge } from 'rxjs';

// Validação Padrão
import { DisplayMessage, GenericValidator, ValidationMessages } from '../utils/generic-form.validation';

export abstract class FormBaseComponent {

  // Mensagem de validação, validador e mostrar erro
  displayMessage: DisplayMessage = {};
  genericValidator: GenericValidator;
  validationMessages: ValidationMessages;

  // Flag para form dirty e não salvo
  mudancasNaoSalvas: boolean;

  protected configurarMensagensValidacaoBase(validationMessages: ValidationMessages) {
    // Instanciar as mensagens de validação
    this.genericValidator = new GenericValidator(validationMessages);
  }

  protected configurarValidacaoFormularioBase(
    formInputElements: ElementRef[],
    formGroup: FormGroup) {

    // Mapear uma coleção de observables através do evento BLUR
    let controlBlurs: Observable<any>[] = formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Em cada ocorrência do BLUR, processar as mensagens
    merge(...controlBlurs).subscribe(() => {
      this.validarFormulario(formGroup)
    });
  }

  // Chamado para processar mensagens de validação
  protected validarFormulario(formGroup: FormGroup) {
    this.displayMessage = this.genericValidator.processarMensagens(formGroup);
    this.mudancasNaoSalvas = true; // Marcar que está sujo e incompleto
  }
}
