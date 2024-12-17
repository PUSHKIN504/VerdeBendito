import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }
  private apiUrl: string = environment.apiUrl;
  private apiKey: string = environment.apiKey;
  private ClienteEncabezado = `${this.apiUrl}/api/Cliente`;


  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'XApiKey': `${this.apiKey}`
      })
    };
  }

   listarClientes(): Observable<any> {
    const url = `${this.ClienteEncabezado}/list`;
    return this.http.get<any>(url, this.getHttpOptions());
  }

  agregarCliente(cliente: any): Observable<any> {
    const url = `${this.ClienteEncabezado}/add`;
    return this.http.post<any>(url, cliente, this.getHttpOptions());
  }

  actualizarCliente(cliente: any): Observable<any> {
    const url = `${this.ClienteEncabezado}/update`;
    return this.http.put<any>(url, cliente, this.getHttpOptions());
  }

  eliminarCliente(id: number): Observable<any> {
    const url = `${this.ClienteEncabezado}/delete/${id}`;
    return this.http.delete<any>(url, this.getHttpOptions());
  }
}
