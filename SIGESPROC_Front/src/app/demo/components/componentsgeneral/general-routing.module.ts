import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'Usuario',
                data: { breadcrumb: 'Usuario' },
                loadChildren: () =>
                    import('./Usuarios/Usuario.module').then(
                        (m) => m.UsuarioModule
                    ),
            },
            {
                path: 'Producto',
                data: { breadcrumb: 'Productos' },
                loadChildren: () =>
                    import('./Productos/Product.module').then(
                        (m) => m.ProductModule
                    ),
            },
            {
                path: 'cliente',
                data: { breadcrumb: 'Clientes' },
                loadChildren: () =>
                    import('./Clientes/Client.module').then(
                        (m) => m.ClientModule
                    ),
            },
            {
                path: 'factura',
                data: { breadcrumb: 'Facturas' },
                loadChildren: () =>
                    import('./Factura/Factura.module').then(
                        (m) => m.FacturaModule
                    ),
            },
           
        ]),
    ],
    exports: [RouterModule],
})
export class GeneralRoutingModule {}
