import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioViewModel } from '../models/usuariosviewmodel';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl: string = environment.apiUrl;
  private apiKey: string = environment.apiKey;
  private UsuarioEncabezado = `${this.apiUrl}/api/User`;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'XApiKey': this.apiKey
      })
    };
  }

  login(username: string, password: string): Observable<any> {
    const url = `${this.UsuarioEncabezado}/login?username=${username}&password=${password}`;
    return this.http.post<any>(url, {}, this.getHttpOptions());
  }

  insertarUsuario(username: string, password: string): Observable<any> {
    const url = `${this.UsuarioEncabezado}/register?username=${username}&password=${password}`;
    return this.http.post<any>(url, {}, this.getHttpOptions());
  }

  actualizarUsuario(id: number, newUsername: string, newPassword: string): Observable<string> {
    const url = `${this.UsuarioEncabezado}/update?id=${id}&newUsername=${newUsername}&newPassword=${newPassword}`;
    return this.http.put<string>(url, {}, { ...this.getHttpOptions(), responseType: 'text' as 'json' });
  }

  listarUsuarios(): Observable<any> {
    const url = `${this.UsuarioEncabezado}/list`;
    return this.http.get<any>(url, this.getHttpOptions());
  }
  logout(): Observable<any> {
    const token = this.cookieService.get('authToken'); 
    const url = `${this.UsuarioEncabezado}/logout?token=${token}`; 
    return this.http.post<any>(url, {}, this.getHttpOptions());
  }
}
