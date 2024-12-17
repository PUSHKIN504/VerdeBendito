import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClientService } from '../../../services/ServiceGral/clientes.service';
import { ProductosService } from '../../../services/ServiceGral/productos.service';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cliente',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
  providers: [MessageService],
})
export class ClientComponent implements OnInit {
  clientes: any[] = [];
  selectedCliente: any;
  Create: boolean = false;
  Index: boolean = true;
  form: FormGroup;
  submitted: boolean = false;
  titulo: string = 'Nuevo Cliente';
  Delete: boolean = false;
  expandedRows: number[] = []; 
  expandedFacturas: number[] = [];
  items = [
    { label: 'Editar', icon: 'pi pi-pencil', command: () => this.editarCliente() },
    { label: 'Eliminar', icon: 'pi pi-trash', command: () => this.confirmarEliminar() },
  ];

  constructor(
    private clienteService: ClientService,
    private fb: FormBuilder,
    private productosService:ProductosService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      rtn: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      direccion: ['', Validators.required],
    });
    this.cargarClientes();
    this.cargarClientesYFacturas();
  }

  cargarClientesYFacturas() {
    forkJoin({
      clientes: this.clienteService.listarClientes(), 
      facturas: this.productosService.listarFactura(),
    }).subscribe({
      next: ({ clientes, facturas }) => {
        this.clientes = clientes.map((cliente: any) => ({
          ...cliente,
          facturas: [], 
        }));
  
        facturas.forEach((factura: any) => {
          const cliente = this.clientes.find(
            (c) => c.id === factura.clienteId
          );
          if (cliente) {
            cliente.facturas.push(factura);
          }
        });
        console.log(this.clientes);
        console.log(facturas);
      },
      error: (err) => {
        console.error("Error al cargar clientes o facturas:", err);
      },
    });
  }
  

  // Métodos para expandir/contraer
  toggleExpandRow(clienteId: number) {
    const index = this.expandedRows.indexOf(clienteId);
    if (index > -1) {
      this.expandedRows.splice(index, 1);
    } else {
      this.expandedRows.push(clienteId);
    }
  }

  toggleFacturaExpand(facturaId: number) {
    const index = this.expandedFacturas.indexOf(facturaId);
    if (index > -1) {
      this.expandedFacturas.splice(index, 1);
    } else {
      this.expandedFacturas.push(facturaId);
    }
  }

  cargarClientes() {
    this.clienteService.listarClientes().subscribe((data) => (this.clientes = data));
  }

  CrearCliente() {
    this.titulo = 'Nuevo Cliente';
    this.Create = true;
    this.Index = false;
    this.form.reset();
  }

  editarCliente() {
    this.titulo = 'Editar Cliente';
    this.Create = true;
    this.Index = false;
    this.form.patchValue(this.selectedCliente);
  }

  Guardar() {
    this.submitted = true;

    if (this.form.valid) {
      const cliente = {
        id: this.selectedCliente?.id || 0,
        nombre: this.form.value.nombre,
        rtn: this.form.value.rtn,
        direccion: this.form.value.direccion,
      };

      if (this.titulo === 'Nuevo Cliente') {
        this.clienteService.agregarCliente(cliente).subscribe({
          next: (response) => {
            if (response && response.status === 200) {
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Éxito', 
                detail: 'Cliente agregado con éxito.' 
              });
            } else {
              this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'No se pudo agregar el cliente.' 
              });
            }
            this.cargarClientes();
            this.CerrarFormulario();
          },
          error: (error) => {
            if (error.status === 200 || error.error?.text?.includes('éxito')) {
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Éxito', 
                detail: 'Cliente agregado con éxito.' 
              });
              this.cargarClientes();
              this.CerrarFormulario();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo agregar el cliente.',
              });
            }
            console.error('Error al agregar cliente:', error);
          },
        });
        
      } else {
        this.clienteService.actualizarCliente(cliente).subscribe({
          next: (response) => {
            if (response && response.status === 200) {
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Éxito', 
                detail: 'Cliente actualizado con éxito.' 
              });
            } else {
              this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'No se pudo actualizar el cliente.' 
              });
            }
            this.cargarClientes();
            this.CerrarFormulario();
          },
          error: (error) => {
            if (error.status === 200 || error.error?.text?.includes('actualizado')) {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Cliente actualizado con éxito.',
              });
              this.cargarClientes();
              this.CerrarFormulario();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar el cliente.',
              });
            }
            console.error('Error al actualizar cliente:', error);
          },
        });
        
      }
    }
  }

  confirmarEliminar() {
    this.Delete = true;
  }

  eliminarCliente() {
    this.Delete = false;
    this.clienteService.eliminarCliente(this.selectedCliente.id).subscribe({
      next: (response) => {
        if (response && response.status === 200) {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Éxito', 
            detail: 'Cliente eliminado con éxito.' 
          });
        } else {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'No se pudo eliminar el cliente.' 
          });
        }
        this.cargarClientes();
      },
      error: (error) => {
        if (error.status === 200 || error.error?.text?.includes('eliminado')) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente eliminado con éxito.',
          });
          this.cargarClientes();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el cliente.',
          });
        }
        console.error('Error al eliminar cliente:', error);
      },
    });
  }

  selectCliente(cliente: any) {
    this.selectedCliente = cliente;
  }

  CerrarFormulario() {
    this.Create = false;
    this.Index = true;
    this.submitted = false;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
