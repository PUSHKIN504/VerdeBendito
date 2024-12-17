import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthGuard } from './guards/auth.guard';
const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '', redirectTo: 'auth', pathMatch: 'full',
            },
            {
                path: 'auth',
                data: { breadcrumb: 'Auth' },
                loadChildren: () =>
                    import('./demo/components/auth/auth.module').then(
                        (m) => m.AuthModule
                    ),
            },
        ]
    },
    {
        path: 'verdebendito',
        component: AppLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'Paginaprincipal',
                data: { breadcrumb: 'Inicio' },
                loadChildren: () =>
                    import('./demo/components/componentsgraficosprincipales/graficosprincipales.module').then((m) => m.GraficoModule),
                canActivate: [AuthGuard],
            },
            {
                path: 'general',
                data: { breadcrumb: 'General' },
                loadChildren: () =>
                    import('./demo/components/componentsgeneral/general.module').then((m) => m.GeneralModule),
                canActivate: [AuthGuard],
            },
            {
                path: 'cliente',
                data: { breadcrumb: 'Clientes' },
                loadChildren: () =>
                    import('./demo/components/componentsgeneral/Clientes/Client.module').then((m) => m.ClientModule),
                canActivate: [AuthGuard],
            },
          
           
           
            
        ],
    },
   
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
