import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientComponent } from './Client.component';

@NgModule({
    imports: [RouterModule.forChild([
		{ path: '', component: ClientComponent }
    ])],
    exports: [RouterModule]
})
export class ClientRoutingModule { }