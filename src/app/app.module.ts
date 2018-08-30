import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RootComponent } from './root.component';
import { HomeComponent } from './home.component';
import { PrincipalComponent } from './principal.component';
import { ReservaComponent } from './reserva.component';
import { PerfilComponent } from './perfil.component';
import { UsuarioComponent } from './admin/usuario.component';
import { LocalComponent } from './admin/local.component';
import { EquipamentoComponent } from './admin/equipamento.component';

const appRoutes: Routes = [  
  { path: '', component: HomeComponent},
  { path: 'principal', component: PrincipalComponent,
      children:[
      {path : '', component: ReservaComponent},
      {path : 'reserva', component: ReservaComponent},
      {path : 'perfil', component: PerfilComponent}] 
  } 
];
  
@NgModule({
  declarations: [
    PrincipalComponent,
    HomeComponent,
    RootComponent,
    ReservaComponent,
    PerfilComponent,
    UsuarioComponent,
    LocalComponent,
    EquipamentoComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),  
    BrowserModule
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { }
