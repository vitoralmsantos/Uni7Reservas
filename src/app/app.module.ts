import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt, 'pt');

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
import { RecursoComponent } from './view/admin/recurso.component';

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
            {path: 'recurso', component: RecursoComponent}
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
    RecursoComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),  
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModule
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'pt' } ],
  bootstrap: [RootComponent]
})
export class AppModule { }
