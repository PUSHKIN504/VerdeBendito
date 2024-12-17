import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuarioComponent } from './Usuario.component';

@NgModule({
    imports: [RouterModule.forChild([
		{ path: '', component: UsuarioComponent }
    ])],
    exports: [RouterModule]
})
export class UsuarioRoutingModule { }