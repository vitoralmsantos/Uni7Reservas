import { Component, OnInit } from '@angular/core';
import { Reserva } from '../model/reserva.model';
import { ReservaRegistro } from '../model/reservaregistro.model';
import { Local } from '../model/local.model';
import { Categoria } from '../model/categoria.model';
import { LocalService } from '../services/local.service';
import { CategoriaService } from '../services/categoria.service';
import { ReservaService } from '../services/reserva.service';
import { AuthService } from '../services/auth.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'uni7res-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {
  titulo: string;
  reserva: ReservaRegistro;
  ngbDate: NgbDateStruct;
  horario: number;
  somenteLabs: boolean;
  localDesabilitado: boolean;
  catDesabilitado: boolean;
  reservas: Reserva[];
  locais: Local[];
  todosLocais: Local[];
  categoria: Categoria[];

  erroDetalhe: string;

  constructor(private localService: LocalService, private categoriaService: CategoriaService,
    private reservaService: ReservaService, private authService: AuthService) { }

  ngOnInit() {
    this.titulo = 'Cadastrar Novo'
    this.limparTotal()
    this.getReservas()
  }

  limparParcial(): void {
    this.reserva = new ReservaRegistro()
    this.reserva.Obs = ''
    this.locais = []
    this.todosLocais = []
    this.categoria = []
    this.localDesabilitado = true
    this.catDesabilitado = true
    if (this.authService.retrieveUserId() !== 0) {
      this.reserva.IdUsuario = Number.parseInt(this.authService.retrieveUserId())
      console.log(this.authService.retrieveUserId())
    }
    else {
      //Usuário não autenticado
      this.reserva.IdUsuario = 1
    }
  }

  limparTotal(): void {
    this.limparParcial()
    this.horario = 0
  }

  onChangeHorario() {
    this.iniciarReserva()
  }

  onChangeSomenteLabs() {
    this.locais = []
    this.locais.push({ Id: 0, Nome: '--Escolha um local--', Reservavel: false, Disponivel: true, Tipo: 0 })
    if (this.somenteLabs) {
      this.locais.push.apply(this.locais, this.todosLocais.filter(l => Number(l.Tipo) === 0))
    }
    else {
      this.locais.push.apply(this.locais, this.todosLocais)
    }
    this.reserva.IdLocal = 0
  }

  //Consulta disponibilidade de locais e equipamentos
  iniciarReserva(): void {
    this.limparParcial()

    if (this.ngbDate === undefined || this.horario == 0) {
      return;
    }

    let dia = String(100 + this.ngbDate.day).substring(1, 3);
    let mes = String(100 + this.ngbDate.month).substring(1, 3);

    this.reserva.Data = dia + '/' + mes + '/' + this.ngbDate.year

    if (this.horario == 1) {
      this.reserva.Turno = 'M';
      this.reserva.Horario = 'AB';
    }
    else if (this.horario == 2) {
      this.reserva.Turno = 'M';
      this.reserva.Horario = 'CD';
    }
    else if (this.horario == 3) {
      this.reserva.Turno = 'M';
      this.reserva.Horario = 'EF';
    }
    else if (this.horario == 4) {
      this.reserva.Turno = 'T';
      this.reserva.Horario = 'AB';
    }
    else if (this.horario == 5) {
      this.reserva.Turno = 'T';
      this.reserva.Horario = 'CD';
    }
    else if (this.horario == 6) {
      this.reserva.Turno = 'T';
      this.reserva.Horario = 'EF';
    }
    else if (this.horario == 7) {
      this.reserva.Turno = 'N';
      this.reserva.Horario = 'AB';
    }
    else if (this.horario == 8) {
      this.reserva.Turno = 'N';
      this.reserva.Horario = 'CD';
    }

    this.localService.getDisponibilidade(this.reserva.Data, this.reserva.Horario, this.reserva.Turno)
      .subscribe(response => {
        if (response === undefined) {
          this.mostraErro('Não foi possível consultar a disponibilidade de locais.')
          this.limparParcial()
        }
        else if (response.Status == 0) {
          this.todosLocais = []
          this.todosLocais.push.apply(this.todosLocais, response.Elementos)
          this.onChangeSomenteLabs()
          this.localDesabilitado = false
        }
        else {
          this.mostraErro(response.Detalhes)
          this.limparParcial()
        }
      });

    this.categoriaService.getDisponibilidade(this.reserva.Data, this.reserva.Horario, this.reserva.Turno)
      .subscribe(response => {
        if (response === undefined) {
          this.mostraErro('Não foi possível consultar a disponibilidade de equipamentos.')
          this.limparParcial()
        }
        else if (response.Status == 0) {
          this.categoria = []
          this.categoria.push({ Id: 0, Nome: '--Escolha um equipamento--' })
          this.reserva.IdCategoria = 0
          this.categoria.push.apply(this.categoria, response.Elementos)
          this.catDesabilitado = false
        }
        else {
          this.mostraErro(response.Detalhes)
          this.limparParcial()
        }
      });
  }

  getReservas(): void {
    this.reservaService.getReservas()
      .subscribe(response => {
        if (response.Status == 0) {
          this.reservas = response.Elementos
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  reservar(): void {
    console.log(this.reserva)
    this.reservaService.addReserva(this.reserva)
      .subscribe(response => {
        if (response === undefined) {
          this.mostraErro('Não foi possível realizar a reserva solicitada.')
        }
        else if (response.Status == 0) {
          this.getReservas();
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  mostraErro(detalhe): void {
    this.erroDetalhe = detalhe
    $('#modalErro').modal('show')
  }
}