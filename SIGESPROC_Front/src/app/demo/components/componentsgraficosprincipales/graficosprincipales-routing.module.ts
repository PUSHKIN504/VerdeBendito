import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'Paginaprincipal',
            data: { breadcrumb: 'Principal' },
            loadChildren: () => import('../componentsgraficosprincipales/graficos/graficos.module').then(m => m.GraficosPrincipalesModule),
        }
    ])],
    exports: [RouterModule],
})
export class GraficosRoutingModule { }
