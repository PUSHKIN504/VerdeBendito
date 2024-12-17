import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UsuarioService } from '../../../services/usuario.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss',

  providers: [MessageService],
})
export class UsuarioComponent implements OnInit {
  usuarios: any[] = [];
  selectedUsuario: any;
  Create: boolean = false;
  Index: boolean = true;
  Delete: boolean = false;
  form: FormGroup;
  titulo: string = 'Nuevo Usuario';
  submitted: boolean = false;
  mostrarPassword: boolean = false;
  items = [
    { label: 'Editar', icon: 'pi pi-user-edit', command: () => this.editarUsuario() },
  ];

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.listarUsuarios().subscribe((data) => {
      this.usuarios = data;
    });
  }

  selectUsuario(usuario: any) {
    this.selectedUsuario = usuario;
  }

  editarUsuario() {
    this.titulo = 'Editar Usuario';
    this.Create = true;
    this.Index = false;
    this.form.patchValue({
      username: this.selectedUsuario.username,
      password: this.selectedUsuario.password,
    });
  }
  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
  mostrarFormularioCrear() {
    this.titulo = 'Nuevo Usuario';
    this.Create = true;
    this.Index = false;
    this.form.reset(); 
  }
  Guardar() {
    this.submitted = true;
    if (this.form.valid) {
      const { username, password } = this.form.value;
  
      if (this.titulo === 'Nuevo Usuario') {
        this.usuarioService.insertarUsuario(username, password).subscribe(() => {
          this.messageService.add({ severity: 'success', detail: 'Usuario creado con éxito.' });
          this.cargarUsuarios();
          this.CerrarFormulario();
        },
        error => {
          this.messageService.add({ severity: 'error', detail: 'El usuario ya existe.' });
          
        }
      );
      } else {
        this.usuarioService
          .actualizarUsuario(this.selectedUsuario.id, username, password)
          .subscribe(() => {
            this.messageService.add({ severity: 'success', detail: 'Usuario actualizado con éxito.' });
            this.cargarUsuarios();
            this.CerrarFormulario();
          },
          error => {
            this.messageService.add({ severity: 'error', detail: 'El usuario ya existe.' });
            
          });
      }
    }
  }
  togglePasswordVisibility() {
    this.mostrarPassword = !this.mostrarPassword;
  }
  
  CerrarFormulario() {
    this.Create = false;
    this.Index = true;
    this.submitted = false;
  }

  CrearUsuario() {
    this.titulo = 'Nuevo Usuario';
    this.Create = true;
    this.Index = false;
    this.form.reset();
  }

 
}
