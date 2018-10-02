import { Component, OnInit } from '@angular/core';
import { Reserva } from '../model/reserva.model';
import { ReservaRegistro } from '../model/reservaregistro.model';
import { Local } from '../model/local.model';
import { Equipamento } from '../model/equipamento.model';
import { LocalService } from '../services/local.service';
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
  desabilitado: boolean;
  reservas: Reserva[];
  locais: Local[];
  equipamentos1: Equipamento[];
  equipamentos2: Equipamento[];

  erroDetalhe: string;

  constructor(private localService: LocalService) { }

  ngOnInit() {
    this.limparTotal()
  }

  limparParcial(): void{
    this.reserva = new ReservaRegistro()
    this.locais = []
    this.equipamentos1 = []
    this.equipamentos2 =[]
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
      if (response.Status == 0) {
        this.locais = response.Locais
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
