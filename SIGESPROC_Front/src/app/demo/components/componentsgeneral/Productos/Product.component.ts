import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProductosService } from '../../../services/ServiceGral/productos.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [MessageService],
})
export class ProductComponent implements OnInit {
  productos: any[] = [];
  selectedProducto: any;
  Create: boolean = false;
  Index: boolean = true;
  form: FormGroup;
  submitted: boolean = false;
  titulo: string = 'Nuevo Producto';
  Delete: boolean = false; 
  
  items = [
    { label: 'Editar', icon: 'pi pi-pencil', command: () => this.editarProducto() },
    { label: 'Eliminar', icon: 'pi pi-trash', command: () => this.EliminarPT() },
  ];

  constructor(
    private productService: ProductosService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      
      nombre: ['', Validators.required],
      precio: ['', [ Validators.required ,Validators.min(1),Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      existencias: ['',[ Validators.required ,Validators.min(1),Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    });
    this.cargarProductos();
  }

  cargarProductos() {
    this.productService.listarProducto().subscribe((data) => (this.productos = data));
  }
  EliminarPT() {
    this.Delete = true;
  }

  CrearProducto() {
    this.titulo = 'Nuevo Producto';
    this.Create = true;
    this.Index = false;
    this.form.reset();
  }

  editarProducto() {
    this.titulo = 'Editar Producto';
    this.Create = true;
    this.Index = false;
    this.form.patchValue(this.selectedProducto);
  }

  Guardar() {
    this.submitted = true;
  
    if (this.form.valid) {
      const producto = {
        id: this.selectedProducto?.id || 0, 
        nombre: this.form.value.nombre,
        precio: this.form.value.precio,
        existencias: this.form.value.existencias,
      };
      console.log(producto);
      if (this.titulo === 'Nuevo Producto') {
        this.productService.agregarProducto(producto).subscribe({
          next: (response) => {
            if (response && response.status === 200) {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Producto agregado con éxito.',
              });
              this.cargarProductos();
              this.CerrarFormulario();
            }
          },
          error: (error) => {
            if (error.status === 200) {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Producto agregado con éxito.',
              });
              this.cargarProductos();
              this.CerrarFormulario();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo agregar el producto.',
              });
              console.error('Error al agregar producto:', error);
            }
          },
        });
      } else {
        this.productService.actualizarProducto(producto).subscribe({
          next: (response) => {
            if (response && response.status === 200) {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Producto actualizado con éxito.',
              });
              this.cargarProductos();
              this.CerrarFormulario();
            }
          },
          error: (error) => {
            if (error.status === 200) {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Producto actualizado con éxito.',
              });
              this.cargarProductos();
              this.CerrarFormulario();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar el producto.',
              });
              console.error('Error al actualizar producto:', error);
            }
          },
        });
      }
    }
  }
onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }


eliminarProducto() {
    this.Delete = false;
    this.productService.eliminarProducto(this.selectedProducto.id).subscribe({
      next: (response) => {
        if (response && response.status === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Producto Eliminado con éxito.',
          });
          this.cargarProductos();
        }
      },
      error: (error) => {
        if (error.status === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Producto Eliminado con éxito.',
          });
          this.cargarProductos();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo Eliminado el producto.',
          });
          console.error('Error al Eliminado producto:', error);
        }
      },
    });
  }

  selectProducto(producto: any) {
    this.selectedProducto = producto;
  }

  CerrarFormulario() {
    this.Create = false;
    this.Index = true;
    this.submitted = false;
  }
}
