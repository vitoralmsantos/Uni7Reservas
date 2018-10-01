import { Component, OnInit } from '@angular/core';
import { Reserva } from '../model/reserva.model';
import { ReservaRegistro } from '../model/reservaregistro.model';
import { Local } from '../model/local.model';
import { Equipamento } from '../model/software.model';

@Component({
  selector: 'uni7res-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {
  reserva: ReservaRegistro;
  horario: number;
  somenteLabs : boolean;
  reservas: Reserva[];
  locais: Local[];
  equipamentos1: Equipamento[];
  equipamentos2: Equipamento[];

  constructor() { }

  ngOnInit() {
  }

  iniciarReserva(): void {
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
  }

}
