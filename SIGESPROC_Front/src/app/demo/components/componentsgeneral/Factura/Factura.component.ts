import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../services/ServiceGral/clientes.service';
import { ProductosService } from '../../../services/ServiceGral/productos.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
})
export class FacturarProductosComponent implements OnInit {
  form: FormGroup;
  clientes: any[] = []; 
  productos: any[] = []; 
  productosSeleccionados: any[] = []; 
  tiposFactura: string[] = ['Crédito', 'Contado'];
  submitted: boolean = false;
  subtotal: number = 0;
  impuesto: number = 0;
  total: number = 0;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClientService,
    private productosService: ProductosService,
    private messageService: MessageService
    
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      clienteId: ['', Validators.required],     
      clienteNombre: ['', Validators.required],  
      tipoFactura: ['', Validators.required],   
      subtotal: [0]                              
    });
  
    this.cargarClientes();
    this.cargarProductos();
  }
  validarEntradaNumerica(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
  
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  generarFactura() {
    this.submitted = true;
    if (this.form.invalid ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe de llenar todos los campos solicitados.',
      });
      return;
    }
    if (this.productosSeleccionados.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe de seleccionar almenos un producto para generar la factura.',
      });
      return;
    }
    if (this.counterr > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Las canitades no pueden exceder la existencia.',
      });
      return;
    }
  
    const factura = {
      id: 0,
      clienteId: this.form.value.clienteId,
      clienteNombre: this.form.value.clienteNombre,
      tipoFactura: this.form.value.tipoFactura,
      subtotal: this.subtotal,
      detalles: this.productosSeleccionados.map((producto) => ({
        productoId: producto.productoId,
        nombreProducto: producto.nombreProducto,
        cantidad: producto.cantidad,
        precio: producto.precio,
      })),
    };
  
    console.log('Factura a enviar:', factura);
  
    this.productosService.generarFactura(factura).subscribe({
      next: (response) => {
        if (response && response.status === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Factura generada con éxito.',
          });
          this.limpiarFactura();
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Factura generada con éxito.',
          });
          this.limpiarFactura();
        }
      },
      error: (error) => {
        if (error.status === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Factura generada con éxito.',
          });
          this.limpiarFactura();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrió un error al generar la factura.',
          });
          console.error('Error al generar factura:', error);
        }
      },
    });
  }
  
  limpiarFactura() {
    this.form.reset();
    this.productosSeleccionados = [];
    this.subtotal = 0;
    this.impuesto = 0;
    this.total = 0;
    this.ngOnInit();
    this.productos.forEach((p) => {
      p.seleccionado = false;
      p.cantidad = null;
    });
  }
  
  onClienteSelect(event: any) {
    this.form.patchValue({
      clienteId: event.value.id,         
      clienteNombre: event.value.nombre, 
    });
    console.log('Cliente seleccionado:', event);
    this.validarFormulario();
  }
  validarFormulario() {
    console.log('Estado del formulario:', this.form.value, this.form.valid);
  }
  onTipoFacturaChange() {
    console.log('Tipo de factura seleccionado:', this.form.value);
    this.validarFormulario();
  }

  cargarClientes() {
    this.clienteService.listarClientes().subscribe((data) => (this.clientes = data));
  }

  cargarProductos() {
    this.productosService.listarProducto().subscribe((data) => (this.productos = data));
  }

  toggleProductoSeleccionado(producto: any) {
    if (producto.seleccionado) {
      if (!producto.cantidad) {
        producto.cantidad = 1;
      }
  
      const existe = this.productosSeleccionados.find((p) => p.productoId === producto.id);
      if (!existe) {
        this.productosSeleccionados.push({
          productoId: producto.id,
          nombreProducto: producto.nombre,
          cantidad: producto.cantidad,
          precio: producto.precio,
          subtotal: producto.cantidad * producto.precio,
          excedeExistencia: false,
          
        });
      }
    } else {
      if (producto.excedeExistencia) {
        this.counterr--;
        producto.excedeExistencia = false; 
      }
      this.productosSeleccionados = this.productosSeleccionados.filter(
        (p) => p.productoId !== producto.id
      );
  
      producto.cantidad = null;
      producto.seleccionado = false;
    }
    console.log('Productos seleccionados:', this.productosSeleccionados);
    this.calcularTotales();
  }
  counterr: number = 0;
  actualizarCantidad(producto: any) {
    if (producto.cantidad > producto.existencias) {
      if (!producto.excedeExistencia) {
        this.counterr++;
        producto.excedeExistencia = true;
      }
  
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Cantidad no puede exceder la existencia.',
      });
      return; 
    } else {
      if (producto.excedeExistencia) {
        this.counterr--;
        producto.excedeExistencia = false;
      }
    }
  
    if (producto.cantidad < 1 || !producto.cantidad) {
      producto.cantidad = 1;
    }
  
    const item = this.productosSeleccionados.find((p) => p.productoId === producto.id);
    if (item) {
      item.cantidad = producto.cantidad;
      item.subtotal = item.cantidad * item.precio;
    }
  
    this.calcularTotales();
  }
  
  
  calcularTotales() {
    this.subtotal = this.productosSeleccionados.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    this.impuesto = this.subtotal * 0.15;
    this.total = this.subtotal + this.impuesto;
  
    this.form.get('subtotal')?.setValue(this.subtotal);
  }
  
  esFormularioCompleto(): boolean {
    return this.form.valid;
  }
  
}
