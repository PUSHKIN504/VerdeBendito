import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private http: HttpClient) { }
  private apiUrl: string = environment.apiUrl;
  private apiKey: string = environment.apiKey;
  private ProductEncabezado = `${this.apiUrl}/api/Product`;


  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'XApiKey': `${this.apiKey}`
      })
    };
  }

  listarProducto(): Observable<any> {
    const url = `${this.ProductEncabezado}/list`;
    return this.http.get<any>(url, this.getHttpOptions());
  }
  agregarProducto(product: any): Observable<any> {
    const url = `${this.ProductEncabezado}/add`;
    return this.http.post<any>(url, product, this.getHttpOptions());
  }
  generarFactura(factura: any): Observable<any> {
    const url = `${this.apiUrl}/api/Factura/generate`;
    return this.http.post<any>(url, factura, this.getHttpOptions());
  }
  listarFactura(): Observable<any> {
    const url = `${this.apiUrl}/api/Factura/list`;
    return this.http.get<any>(url,  this.getHttpOptions());
  }
  actualizarProducto(product: any): Observable<any> {
    const url = `${this.ProductEncabezado}/update`;
    return this.http.put<any>(url, product, this.getHttpOptions());
  }
  eliminarProducto(id: number): Observable<any> {
    const url = `${this.ProductEncabezado}/delete/${id}`;
    return this.http.delete<any>(url, this.getHttpOptions());
  }
}
