import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexLegend,
  ApexTooltip
} from "ng-apexcharts";
import { NgApexchartsModule } from "ng-apexcharts";
import { Message } from '../../interfaces/Message.interface';
import { MessagesService } from '../../services/Messages.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  fill: ApexFill;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  legend: ApexLegend,
  colors: string[];
  tooltip: ApexTooltip
};

@Component({
  selector: 'app-GraphicMessages',
  templateUrl: './GraphicMessages.component.html',
  styleUrls: ['./GraphicMessages.component.css'],
  standalone: true,
  imports: [NgApexchartsModule]
})
export class GraphicMessagesComponent implements OnInit {
  public mensajes: Message[] = [];
  public messagesService = inject(MessagesService);
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = this.getChartOptions([], []);
  }

  ngOnInit() {
    this.mensajes = this.messagesService.mensajes()!;
    this.actualizarGrafico();
    console.log("MensajesO:", JSON.stringify(this.mensajes, null, 2));
  }

  private actualizarGrafico() {
    const mensajesSeparados = this.separarPorIdMensaje(this.mensajes);
    const datos = this.procesarDatos(mensajesSeparados);
    this.chartOptions = this.getChartOptions(datos.series, datos.fechas);

    if (this.chart) {
      this.chart.updateOptions(this.chartOptions);
    }
  }

  private getChartOptions(series: any[], fechas: string[]): Partial<ChartOptions> {
    return {
      series: series,
      chart: {
        type: 'area', // Cambiado de 'area' a 'line'
        height: 750,
        zoom: { enabled: true }
      },
      dataLabels: { enabled: true },
      stroke: {
        width: 4, // Aumentado para mejor visibilidad
        curve: 'smooth'
      },
      markers: {
        size: 4,
        strokeColors: "#ffffff",
        strokeWidth: 2,
        hover: { size: 7 }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 0.7,
          opacityTo: 0.5,
        },
      },
      xaxis: {
        type: 'datetime',
        categories: fechas
      },
      yaxis: {
        min: 0,
        forceNiceScale: true,
        labels: { formatter: (val) => Math.round(val).toString() },
        title: { text: "Número de mensajes" }
      },
      title: { text: "Mensajes Enviados por Tipo", align: "left" },
      legend: { position: "top" },
      colors: ["#84bd00", "#00859b", "#ffcd00", "#118eda", "#775DD0"],
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (y) => typeof y !== "undefined" ? y.toFixed(0) + " mensajes" : y
        }
      }
    };
  }

  private separarPorIdMensaje(mensajes: any[]): { [key: string]: any[] } {
    return mensajes.reduce((acc, mensaje) => {
      const tipoMensaje = this.obtenerTipoMensaje(mensaje.mensaje);
      if (!acc[tipoMensaje]) {
        acc[tipoMensaje] = [];
      }
      acc[tipoMensaje].push(mensaje);
      return acc;
    }, {} as { [key: string]: any[] });
  }

  private obtenerTipoMensaje(mensaje: string): string {
    if (mensaje.includes("factura por valor de") && !mensaje.includes("pago de tu factura")) {
      return "Factura Generada";
    } else if (mensaje.includes("pago de tu factura") && mensaje.includes("fue exitoso")) {
      return "Pago de Factura";
    } else if (mensaje.includes("materias fueron inscritas")) {
      return "Inscripción de Materias";
    } else {
      return "Otro";
    }
  }

  private procesarDatos(mensajesPorTipo: { [key: string]: any[] }): { series: { name: string, data: { x: number, y: number }[] }[], fechas: string[] } {
    const conteosPorTipoYFecha: { [key: string]: { [fecha: string]: number } } = {};
    const todasLasFechas = new Set<string>();

    Object.entries(mensajesPorTipo).forEach(([tipo, mensajes]) => {
      conteosPorTipoYFecha[tipo] = mensajes.reduce((acc, mensaje) => {
        const fecha = mensaje.fechaEntrada.split(' ')[0];
        acc[fecha] = (acc[fecha] || 0) + 1;
        todasLasFechas.add(fecha);
        return acc;
      }, {});
    });

    const fechas = Array.from(todasLasFechas).sort();

    const series = Object.entries(conteosPorTipoYFecha).map(([tipo, conteos]) => ({
      name: tipo,
      data: fechas.map(fecha => ({
        x: new Date(fecha).getTime(),
        y: conteos[fecha] || 0
      }))
    }));

    return { series, fechas };
  }
}
