import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ETIQUETA_NIVEL, Evolucion, PuntoEvolucion } from '../../domain/estadistica.model';
import { ImagenGrafico } from './grafico.component';

type DocumentoConTabla = jsPDF & { lastAutoTable: { finalY: number } };

@Injectable({ providedIn: 'root' })
export class PdfEvolucionService {
  generar(
    evolucion: Evolucion,
    puntos: PuntoEvolucion[],
    imagen: ImagenGrafico | null,
    desde: string,
    hasta: string,
  ): void {
    const doc = new jsPDF() as DocumentoConTabla;
    const ancho = doc.internal.pageSize.getWidth();

    doc.setFillColor(75, 52, 201);
    doc.rect(0, 0, ancho, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('PequeMentes - Informe de evolución', 14, 13);
    doc.setFontSize(10);
    doc.text(`Generado el ${new Date().toLocaleDateString('es')}`, 14, 21);

    doc.setTextColor(40, 40, 60);
    doc.setFontSize(13);
    doc.text(`Paciente: ${evolucion.pacienteNombre}`, 14, 40);
    doc.setFontSize(10);
    const periodo =
      desde || hasta
        ? `Periodo: del ${desde || 'inicio'} al ${hasta || 'día de hoy'}`
        : 'Periodo: todas las evaluaciones';
    doc.text(periodo, 14, 47);

    let y = 54;
    if (imagen) {
      const alto = (180 * imagen.alto) / imagen.ancho;
      doc.addImage(imagen.url, 'PNG', 14, y, 180, alto);
      y += alto + 8;
    }

    autoTable(doc, {
      startY: y,
      head: [['Fecha', 'Evaluación', 'Resultado', 'Intensidad', 'Síntomas']],
      body: puntos.map((p) => [
        p.fecha,
        p.instrumento,
        ETIQUETA_NIVEL[p.nivel] ?? p.nivel,
        `${p.porcentaje}%`,
        `${p.sintomas} de ${p.totalPreguntas}`,
      ]),
      headStyles: { fillColor: [75, 52, 201] },
      styles: { fontSize: 9 },
    });

    let final = doc.lastAutoTable.finalY + 10;
    if (final > 280) {
      doc.addPage();
      final = 20;
    }
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 130);
    doc.text('Este informe es un apoyo para la psicóloga. No constituye un diagnóstico.', 14, final);

    const nombreArchivo = evolucion.pacienteNombre.replace(/\s+/g, '-').toLowerCase();
    doc.save(`evolucion-${nombreArchivo}.pdf`);
  }
}