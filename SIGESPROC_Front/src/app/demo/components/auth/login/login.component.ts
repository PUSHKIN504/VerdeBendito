import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.scss'],
  providers: [MessageService],
})
export class LoginComponent {
  usuario?: string; 
  clave?: string;
  usuarioValidarClave: boolean = false;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private cookieService: CookieService
  ) {}

  Login(): void {
    const username = this.usuario?.trim();
    const password = this.clave?.trim();
  
    if (username && password) {
      this.usuarioService.login(username, password).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          if (response.token) {
            this.cookieService.set('authToken', response.token, 1, '/'); 
            this.cookieService.set('nombreUsuario', username, 1, '/'); 
            this.router.navigate(['/verdebendito/Paginaprincipal/Paginaprincipal']);
          } else {
            this.mostrarError('Credenciales incorrectas.');
          }
        },
        error: (error) => {
          if (error.error === "Invalid credentials.") {
            this.mostrarError('Credenciales incorrectas.');
          }
          else{
          console.error('Error:', error);
          this.mostrarError('Ocurrió un problema al iniciar sesión.');}
        },
      });
    } else {
      this.mostrarError('Debe ingresar usuario y contraseña.');
    }
  }
  mostrarError(mensaje: string): void {
    this.usuarioValidarClave = true;
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: mensaje,
      life: 3000,
    });
  }
}
