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
import { AdminComponent } from './admin/admin.component';
import { RelatorioReservasComponent } from './relatorios/relatorio-reservas.component';
import { RelatorioAvaliacaoComponent } from './relatorios/relatorio-avaliacao.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { AvaliacaoComponent } from './admin/avaliacao.component';

const appRoutes: Routes = [  
  { path: '', component: HomeComponent},
  { path: 'principal', component: PrincipalComponent,
      children:[
        {path : '', component: ReservaComponent},
        {path : 'reserva', component: ReservaComponent},
        {path : 'perfil', component: PerfilComponent},
        {path : 'relatorios', component: RelatoriosComponent,
          children:[
            {path : 'reservas', component: RelatorioReservasComponent},
            {path : 'avaliacao', component: RelatorioAvaliacaoComponent}
          ]
        },
        {path : 'admin', component: AdminComponent,
          children:[
            {path : 'usuario', component: UsuarioComponent},
            {path : 'local', component: LocalComponent},
            {path : 'equipamento', component: EquipamentoComponent},
            {path: 'avaliacao', component: AvaliacaoComponent}
          ]
        }
      ] 
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
    EquipamentoComponent,
    AdminComponent,
    RelatorioReservasComponent,
    RelatorioAvaliacaoComponent,
    RelatoriosComponent,
    AvaliacaoComponent
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
