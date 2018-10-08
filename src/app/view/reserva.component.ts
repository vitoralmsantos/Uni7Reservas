import { Component, OnInit } from '@angular/core';
import { Reserva } from '../model/reserva.model';
import { ReservaRegistro } from '../model/reservaregistro.model';
import { Local } from '../model/local.model';
import { Categoria } from '../model/categoria.model';
import { LocalService } from '../services/local.service';
import { CategoriaService } from '../services/categoria.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'uni7res-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {
  reserva: ReservaRegistro;
  ngbDate: NgbDateStruct;
  horario: number;
  somenteLabs : boolean;
  localDesabilitado: boolean;
  catDesabilitado: boolean;
  reservas: Reserva[];
  locais: Local[];
  categoria1: Categoria[];
  categoria2: Categoria[];

  erroDetalhe: string;

  constructor(private localService: LocalService, private categoriaService: CategoriaService) { }

  ngOnInit() {
    this.limparTotal()
  }

  limparParcial(): void{
    this.reserva = new ReservaRegistro()
    this.locais = []
    this.categoria1 = []
    this.categoria2 =[]
    this.desabilitado = true
  }

  limparTotal(): void{
    this.limparParcial()
    this.horario = 0
  }

  onChange(horario) {
    this.horario = horario
    this.iniciarReserva()
  }

  //Consulta disponibilidade de locais e equipamentos
  iniciarReserva(): void {
    this.limparParcial()

    if (this.ngbDate === undefined || this.horario == 0){
      return;
    }
    
    this.reserva.Data = this.ngbDate.day + '/' + this.ngbDate.month + '/' + this.ngbDate.year

    switch (this.horario) {
      case 1:
        this.reserva.Turno = 'M';
        this.reserva.Horario = 'AB';
        break;
      case 2:
        this.reserva.Turno = 'M';
        this.reserva.Horario = 'CD';
        break;
      case 3:
        this.reserva.Turno = 'M';
        this.reserva.Horario = 'EF';
        break;
      case 4:
        this.reserva.Turno = 'T';
        this.reserva.Horario = 'AB';
        break;
      case 5:
        this.reserva.Turno = 'T';
        this.reserva.Horario = 'CD';
        break;
      case 6:
        this.reserva.Turno = 'T';
        this.reserva.Horario = 'EF';
        break;
      case 7:
        this.reserva.Turno = 'N';
        this.reserva.Horario = 'AB';
        break;
      case 8:
        this.reserva.Turno = 'N';
        this.reserva.Horario = 'CD';
        break;
    }

    this.localService.getDisponibilidade(this.reserva.Data, this.reserva.Horario, this.reserva.Turno)
    .subscribe(response => {
      if (response === undefined){
        this.mostraErro('Não foi possível consultar a disponibilidade de locais.')
      }
      else if (response.Status == 0) {
        this.locais = response.Locais
        this.desabilitado = false
      }
      else {
        this.mostraErro(response.Detalhes)
      }
    });

    this.categoriaService.getDisponibilidade(this.reserva.Data, this.reserva.Horario, this.reserva.Turno)
    .subscribe(response => {
      if (response === undefined){
        this.mostraErro('Não foi possível consultar a disponibilidade de equipamentos.')
      }
      else if (response.Status == 0) {
        this.categoria1 = response.Categorias
        this.categoria2 = response.Categorias
        this.desabilitado = false
      }
      else {
        this.mostraErro(response.Detalhes)
      }
    });
  }

  reservar(): void {

  }

  mostraErro(detalhe): void {
    this.erroDetalhe = detalhe
    $('#modalErro').modal('show')
  }

}
