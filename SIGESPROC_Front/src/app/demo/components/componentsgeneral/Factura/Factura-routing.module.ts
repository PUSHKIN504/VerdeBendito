import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FacturarProductosComponent } from './Factura.component';

@NgModule({
    imports: [RouterModule.forChild([
		{ path: '', component: FacturarProductosComponent }
    ])],
    exports: [RouterModule]
})
export class FacturaRoutingModule { }