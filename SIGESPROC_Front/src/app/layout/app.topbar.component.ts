import { Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';

import { CookieService } from 'ngx-cookie-service';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { SwPush } from '@angular/service-worker';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { usuario } from 'src/app/demo/models/modelsplanilla/usuarioviewmodel';
import { CommonModule } from "@angular/common"; //no
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputGroupModule } from "primeng/inputgroup";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { RippleModule } from "primeng/ripple";
import { SplitButtonModule } from "primeng/splitbutton";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { ToggleButtonModule } from "primeng/togglebutton";
import { CheckboxModule } from 'primeng/checkbox';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UsuarioService } from '../../app/demo/services/usuario.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  providers: [MessageService]

})

export class AppTopbarComponent {

  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('searchinput') searchInput!: ElementRef;
  @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
  searchActive: boolean = false;
  valor: number = 0;
    usuario: number = parseInt(this.cookieService.get('usua_Id'));
  campana: boolean = true;
  visible: boolean = false;
  Usuario: usuario[] = [];
  items: MenuItem[] = [];
  Index: boolean = true;
  Create: boolean = false;
  Detail: boolean = false;
  Delete: boolean = false;
  form: FormGroup;
  submitted: boolean = false;
  identity: string = "Crear";
  selectedUsuario: usuario;
  id: number = parseInt(this.cookieService.get('usua_Id'));
 
  contra: boolean = false;
  editarUsuarioDialog: boolean = false;
  filteredRoles: any[] = [];
  
  Datos = [{}];
  
  Admin: boolean = true;
  modalCorreo: boolean = false;
  modalContra: boolean = false;
  confirm: boolean = false;

  private actionItemsCache = new Map();





  constructor(
    public layoutService: LayoutService,
    public el: ElementRef,
    public cookieService: CookieService,
    private messageService: MessageService,
    private userService: UsuarioService,
    private swPush: SwPush,
    // private notificationService: NotificationPushService,
    private router: Router,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,

    //Inyectamos el servicio de los empleados
  ) {
    this.form = this.fb.group({
      empl_CorreoElectronico: ['', Validators.required],
      usua_Clave: [''], // Agregué el campo de la clave
    });
  }



  ngOnInit(): void {
    
    

    const valorGuardado = this.cookieService.get('notificacionesNoLeidas');
    if (valorGuardado) {
        this.valor = parseInt(valorGuardado, 10);
        this.campana = this.valor > 0;
    }
  }


  // cerrarSesion(): void {
   
  //   this.cookieService.deleteAll('/'); 
  //   window.location.href = 'http://localhost:4200/#/auth/login';
  // }

  cerrarSesion() {
    this.userService.logout().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Cierre de sesión',
            detail: response.message || 'Sesión cerrada exitosamente.',
          });
  
          this.cookieService.deleteAll( '/');
          this.router.navigate(['/auth/login']);
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'No se pudo cerrar sesión.',
          });
        }
       
      },
      error: (error) => {
        if (error.status === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Cierre de sesión',
            detail: error.message || 'Sesión cerrada exitosamente.',
          });
  
          this.cookieService.deleteAll('/');
          this.router.navigate(['/auth/login']);
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'No se pudo cerrar sesión.',
          });
        }
      },
    });

    this.cookieService.deleteAll('/'); 
    window.location.href = 'http://localhost:4200/#/auth/login';
  }
  sanitizarUrl(base64: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(base64);

}




  CloseDialog() {
    this.modalContra = false;
    this.modalCorreo = false;
    this.submitted = false;
    this.form.reset();
  }




  onMenuButtonClick() {
    this.layoutService.onMenuToggle();
  }

   activateSearch() {
    this.searchActive = true;
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 100);
  }

  deactivateSearch() {
    this.searchActive = false;
  }


  onConfigButtonClick() {
    this.layoutService.showConfigSidebar();
  }

  onSidebarButtonClick() {
    this.layoutService.showSidebar();
  }

  

 

  unsubscribe() {
    if (this.swPush.isEnabled && Notification.permission == 'granted')
      this.swPush.unsubscribe();
  }

  getToken() {
    if (this.swPush.isEnabled && Notification.permission == 'granted')
      this.swPush.subscription.subscribe((subscription) => {
      });
  }





  showConfirm() {
    if (!this.visible) {
      this.visible = true;
    }
  }

  onConfirm() {
    this.messageService.clear('confirm');
    this.visible = false;
  }

  onReject() {
    this.messageService.clear('confirm');
    this.visible = false;
  }









  }



@NgModule({
  imports: [
    CheckboxModule,
    AutoCompleteModule,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    CalendarModule,
    ToggleButtonModule,
    RippleModule,
    InputGroupModule,
    MultiSelectModule,
    DropdownModule,
    DialogModule,
    SplitButtonModule,
  ],
})
export class AppTopBarModule { }
function onMenuButtonClick() {
  throw new Error('Function not implemented.');
}

