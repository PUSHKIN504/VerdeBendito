import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../services/ServiceGral/productos.service';
import {  registerables } from 'chart.js';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
})
export class GraficosComponent implements OnInit {
  chartFacturasPorCliente: any;
  chartDistribucionSubtotal: any;
  chartTiposFactura: any;
  constructor(private facturaService: ProductosService) {}

  ngOnInit(): void {
    this.cargarFacturasPorCliente();
    this.cargarDistribucionSubtotal();
    this.cargarTiposDeFacturaPorCliente();
  }

  cargarFacturasPorCliente(): void {
    this.facturaService.listarFactura().subscribe({
      next: (data) => {
        const resumen = data.reduce((acc: any, curr: any) => {
          acc[curr.clienteNombre] = (acc[curr.clienteNombre] || 0) + 1;
          return acc;
        }, {});
  
        const labels = Object.keys(resumen);
        const valores = Object.values(resumen);
  
        this.chartFacturasPorCliente = new Chart('chartFacturasPorCliente', {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Total de Facturas',
                data: valores,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: { responsive: true, plugins: { legend: { position: 'top' } } },
        });
      },
      error: (err) => console.error('Error al cargar gráfico:', err),
    });
  }
  cargarDistribucionSubtotal(): void {
    this.facturaService.listarFactura().subscribe({
      next: (data) => {
        const resumen = data.reduce((acc: any, curr: any) => {
          acc[curr.tipoFactura] = (acc[curr.tipoFactura] || 0) + curr.subtotal;
          return acc;
        }, {});
  
        const labels = Object.keys(resumen);
        const valores = Object.values(resumen);
  
        this.chartDistribucionSubtotal = new Chart('chartDistribucionSubtotal', {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Subtotal',
                data: valores,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              },
            ],
          },
          options: { responsive: true, plugins: { legend: { position: 'top' } } },
        });
      },
      error: (err) => console.error('Error al cargar gráfico:', err),
    });
  }

  cargarTiposDeFacturaPorCliente(): void {
    this.facturaService.listarFactura().subscribe({
      next: (data) => {
        const resumen = data.reduce((acc: any, curr: any) => {
          if (!acc[curr.clienteNombre]) {
            acc[curr.clienteNombre] = { Crédito: 0, Contado: 0 };
          }
          acc[curr.clienteNombre][curr.tipoFactura] += 1;
          return acc;
        }, {});
  
        const labels = Object.keys(resumen); 
        const creditos = labels.map((cliente) => resumen[cliente].Crédito); 
        const contados = labels.map((cliente) => resumen[cliente].Contado); 
  
        this.renderizarGraficoTiposFactura(labels, creditos, contados);
      },
      error: (err) => console.error('Error al cargar gráfico:', err),
    });
  }
  
  renderizarGraficoTiposFactura(labels: string[], creditos: number[], contados: number[]): void {
    const ctx = document.getElementById('chartTiposFactura') as HTMLCanvasElement;
  
    if (this.chartTiposFactura) {
      this.chartTiposFactura.destroy(); 
    }
  
    this.chartTiposFactura = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Crédito',
            data: creditos,
            backgroundColor: 'rgba(54, 162, 235, 0.6)', 
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Contado',
            data: contados,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true },
        },
      },
    });
  }
}
