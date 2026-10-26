import { Injectable, signal } from '@angular/core';

export type Tema = 'NEUTRO' | 'NINO' | 'NINA';

@Injectable({ providedIn: 'root' })
export class TemaService {
  readonly tema = signal<Tema>('NEUTRO');

  aplicar(genero: string | null | undefined): void {
    const tema: Tema = genero === 'NINO' ? 'NINO' : genero === 'NINA' ? 'NINA' : 'NEUTRO';
    this.tema.set(tema);
    document.body.classList.remove('tema-nino', 'tema-nina');
    if (tema === 'NINO') {
      document.body.classList.add('tema-nino');
    } else if (tema === 'NINA') {
      document.body.classList.add('tema-nina');
    }
  }
}