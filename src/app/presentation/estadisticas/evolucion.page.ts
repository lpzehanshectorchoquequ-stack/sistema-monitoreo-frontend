import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BotonAtrasComponent } from '../shared/boton-atras.component';
import { EvolucionNinoComponent } from './evolucion-nino.component';

@Component({
  selector: 'app-evolucion',
  imports: [BotonAtrasComponent, EvolucionNinoComponent],
  template: `
    <div class="pagina">
      <app-boton-atras />
      <app-evolucion-nino [pacienteId]="id" titulo="Evolución del niño o niña" />
    </div>
  `,
  styles: `
    .pagina {
      max-width: 1050px;
      margin: 0 auto;
    }
  `,
})
export class EvolucionPage {
  protected readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
}