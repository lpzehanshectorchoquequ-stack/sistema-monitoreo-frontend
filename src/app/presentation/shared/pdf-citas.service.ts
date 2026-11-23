import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EstadisticasCitas } from '../../domain/estadistica-citas.model';
import { ImagenGrafico } from './grafico.component';

type DocumentoConTabla = jsPDF & { lastAutoTable: { finalY: number } };

const bs = (valor: number): string => 'Bs ' + valor.toFixed(2);

@Injectable({ providedIn: 'root' })
export class PdfCitasService {
  generar(datos: EstadisticasCitas, etiquetaPeriodo: string, esAdmin: boolean, imagen: ImagenGrafico | null): void {
    const doc = new jsPDF() as DocumentoConTabla;
    const ancho = doc.internal.pageSize.getWidth();

    doc.setFillColor(75, 52, 201);
    doc.rect(0, 0, ancho, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('PequeMentes - Informe de citas e ingresos', 14, 13);
    doc.setFontSize(10);
    doc.text(`Generado el ${new Date().toLocaleDateString('es')}`, 14, 21);

    doc.setTextColor(40, 40, 60);
    doc.setFontSize(12);
    doc.text(`${esAdmin ? 'Todas las psicólogas' : 'Mi consulta'} · ${etiquetaPeriodo}`, 14, 40);
    doc.setFontSize(10);
    doc.text(`Periodo: del ${datos.desde} al ${datos.hasta}`, 14, 47);

    autoTable(doc, {
      startY: 54,
      head: [['Indicador', 'Valor']],
      body: [
        ['Citas en el periodo', String(datos.totalCitas)],
        ['Atendidas', String(datos.atendidas)],
        ['Confirmadas (por atender)', String(datos.confirmadas)],
        ['Esperando respuesta', String(datos.pendientes)],
        ['Canceladas o rechazadas', String(datos.canceladas)],
        ['No asistieron', String(datos.noAsistio)],
        ['Asistencia', datos.asistencia === null ? 'Sin datos' : `${datos.asistencia}%`],
        ['Ingresos del periodo', bs(datos.ingresosPeriodo)],
        ['Ingresos de esta semana', bs(datos.ingresosSemana)],
      ],
      headStyles: { fillColor: [75, 52, 201] },
      styles: { fontSize: 10 },
    });

    let y = doc.lastAutoTable.finalY + 8;
    if (imagen) {
      const alto = (180 * imagen.alto) / imagen.ancho;
      if (y + alto > 280) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(11);
      doc.text('Ingresos por semana (Bs)', 14, y);
      doc.addImage(imagen.url, 'PNG', 14, y + 3, 180, alto);
      y += alto + 12;
    }

    autoTable(doc, {
      startY: y,
      head: [['Semana desde', 'Atendidas', 'Canceladas', 'No asistió', 'Ingresos']],
      body: datos.semanas.map((s) => [s.desde, s.atendidas, s.canceladas, s.noAsistio, bs(s.ingresos)]),
      headStyles: { fillColor: [75, 52, 201] },
      styles: { fontSize: 9 },
    });

    if (esAdmin && datos.porPsicologa.length > 0) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Psicóloga', 'Citas', 'Atendidas', 'Asistencia', 'Ingresos']],
        body: datos.porPsicologa.map((p) => [
          p.nombre,
          p.totalCitas,
          p.atendidas,
          p.asistencia === null ? '-' : `${p.asistencia}%`,
          bs(p.ingresos),
        ]),
        headStyles: { fillColor: [75, 52, 201] },
        styles: { fontSize: 9 },
      });
    }

    let final = doc.lastAutoTable.finalY + 10;
    if (final > 280) {
      doc.addPage();
      final = 20;
    }
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 130);
    doc.text('Los ingresos se calculan con el costo de las citas marcadas como atendidas.', 14, final);

    doc.save(`informe-citas-${datos.periodo.toLowerCase()}.pdf`);
  }
}