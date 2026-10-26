import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionStore } from '../../application/session.store';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.page.html',
})
export class InicioPage {
  protected readonly sesion = inject(SessionStore).sesion;
}