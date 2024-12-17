import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];

    constructor(
        private router: Router,
        private cookieService: CookieService 
    ) {}

    ngOnInit() {
        this.cargarMenuCompleto();
        
    }

    irAPlanilla() {
        const randomParam = Math.random(); // Genera un valor aleatorio para forzar la navegación
        return this.router.navigate(['/homejourney/planilla/planilla', { refresh: randomParam }]);
      }

    

    cargarMenuCompleto() {
        const nombreUsuario = this.cookieService.get('nombreUsuario'); 
        console.log('Nombre del usuario:', nombreUsuario);

        this.model = [
            {
              icon: 'pi pi-th-large',
              items: [
                {
                  label: 'Inicio',
                  icon: 'pi pi-home',
                  routerLink: ['/verdebendito/Paginaprincipal/Paginaprincipal']
                },
                {
                  label: 'Generales',
                  icon: 'pi pi-images',
                  items: [
                    {
                      label: 'Usuario',
                      icon: 'pi pi-fw pi-users',
                      routerLink: ['/verdebendito/general/Usuario']
                    },
                    {
                      label: 'Productos',
                      icon: 'pi pi-fw pi-shopping-cart',
                      routerLink: ['/verdebendito/general/Producto']
                    },
                    {
                      label: 'Clientes',
                      icon: 'pi pi-fw pi-user',
                      routerLink: ['/verdebendito/general/cliente']
                    },
                    {
                      label: 'Generar Factura',
                      icon: 'pi pi-fw pi-file-o',
                      routerLink: ['/verdebendito/general/factura']
                    }
                  ]
                }
              ]
            }
          ];
      
          // Si el usuario es "Gerente de tienda", agregar "Gestión de Viajes" dentro de "Generales"
          if (nombreUsuario === 'Gerente de tienda') {
            const generalesMenu = this.model[0].items.find(item => item.label === 'Generales');
            if (generalesMenu) {
              generalesMenu.items.push({
                label: 'Gestión de Viajes',
                icon: 'pi pi-fw pi-map',
                routerLink: ['/homejourney/general/requisito3']
              });
            }
          }
    }

    

}
