import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GestionarTestsUseCase } from '../../application/gestionar-tests.use-case';
import { AREAS_TEST, TestResumen } from '../../domain/test.model';
import { BotonAtrasComponent } from '../shared/boton-atras.component';
import { BuscadorComponent } from '../shared/buscador.component';
import { normalizar } from '../shared/texto';

@Component({
  selector: 'app-tests-lista',
  imports: [RouterLink, BotonAtrasComponent, BuscadorComponent],
  templateUrl: './tests-lista.page.html',
  styleUrl: './tests.scss',
})
export class TestsListaPage implements OnInit {
  private readonly casoUso = inject(GestionarTestsUseCase);

  protected readonly tests = signal<TestResumen[]>([]);
  protected readonly filtro = signal('');
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly visibles = computed(() => {
    const consulta = normalizar(this.filtro());
    return consulta ? this.tests().filter((t) => normalizar(t.nombre).includes(consulta)) : this.tests();
  });

  ngOnInit(): void {
    this.cargar();
  }

  protected icono(area: string): string {
    return AREAS_TEST.find((a) => a.valor === area)?.icono ?? '🧠';
  }

  protected nombreArea(area: string): string {
    return AREAS_TEST.find((a) => a.valor === area)?.nombre ?? area;
  }

  private cargar(): void {
    this.cargando.set(true);
    this.casoUso.listar().subscribe({
      next: (lista) => {
        this.tests.set(lista);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de tests');
        this.cargando.set(false);
      },
    });
  }

  protected eliminar(test: TestResumen): void {
    if (!confirm(`¿Eliminar el test "${test.nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    this.error.set(null);
    this.casoUso.eliminar(test.id).subscribe({
      next: () => this.cargar(),
      error: (e: HttpErrorResponse) => this.error.set(e.error?.mensaje ?? 'No se pudo eliminar el test'),
    });
  }
}