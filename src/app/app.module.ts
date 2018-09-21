import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 

import { RootComponent } from './view/root.component';
import { HomeComponent } from './view/home.component';
import { PrincipalComponent } from './view/principal.component';
import { ReservaComponent } from './view/reserva.component';
import { PerfilComponent } from './view/perfil.component';
import { UsuarioComponent } from './view/admin/usuario.component';
import { LocalComponent } from './view/admin/local.component';
import { EquipamentoComponent } from './view/admin/equipamento.component';
import { AdminComponent } from './view/admin/admin.component';
import { RelatorioReservasComponent } from './view/relatorios/relatorio-reservas.component';
import { RelatorioAvaliacaoComponent } from './view/relatorios/relatorio-avaliacao.component';
import { RelatoriosComponent } from './view/relatorios/relatorios.component';
import { AvaliacaoComponent } from './view/admin/avaliacao.component';
import { CategoriaComponent } from './view/admin/categoria.component';
import { SoftwareComponent } from './view/admin/software.component';

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
            {path: 'avaliacao', component: AvaliacaoComponent},
            {path: 'categoria', component: CategoriaComponent},
            {path: 'software', component: SoftwareComponent}
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
    AvaliacaoComponent,
    CategoriaComponent,
    SoftwareComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),  
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { }
