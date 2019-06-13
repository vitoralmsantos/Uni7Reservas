import { Component, OnInit } from '@angular/core';
import { Reserva } from '../model/reserva.model';
import { ReservaRegistro } from '../model/reservaregistro.model';
import { Local, TIPOLOCAL } from '../model/local.model';
import { Categoria } from '../model/categoria.model';
import { Usuario } from '../model/usuario.model';
import { LocalService } from '../services/local.service';
import { CategoriaService } from '../services/categoria.service';
import { ReservaService } from '../services/reserva.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import 'moment/locale/pt-br';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'uni7res-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {
  titulo: string
  reserva: ReservaRegistro
  ngbDate: NgbDateStruct
  horario: number
  somenteLabs: boolean
  localDesabilitado: boolean
  catDesabilitado: boolean
  obsDesabilitado: boolean
  reservas: Reserva[]
  reservasExibidas: Reserva[]
  locais: Local[]
  todosLocais: Local[]
  categoria: Categoria[]
  idUsuario: number
  erroDetalhe: string
  spinnerReservas: boolean
  spinnerIniciaReservas: boolean

  obsDetalhe: string
  nomeDetalhe: string
  emailDetalhe: string
  reservadoDetalhe: string
  idDetalhe: number
  indexDetalhe: number

  categoriasFiltro: Categoria[]
  locaisFiltro: Local[]
  obsFiltro: string
  idLocalFiltro: number
  idCategoriaFiltro: number
  ngbDateDe: NgbDateStruct
  horarioDe: string
  ngbDateAte: NgbDateStruct
  horarioAte: string
  descricaoFiltro: string

  idAvaliacao: number
  indexAvaliacao: number
  comentarioUsuario: string
  satisfacao: number

  constructor(private localService: LocalService, private categoriaService: CategoriaService,
    private reservaService: ReservaService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.retrieveUserId() == '0' ) {
      this.router.navigateByUrl('/');
    }

    this.titulo = 'Cadastrar Novo'
    this.spinnerIniciaReservas = false
    this.spinnerReservas = false
    this.limparTotal()
    if (Number.parseInt(this.authService.retrieveUserId()) != 0) {
      this.idUsuario = Number.parseInt(this.authService.retrieveUserId())
    }
    else {
      //Usuário não autenticado
      this.idUsuario = 1
    }
    this.getReservas()
    this.idLocalFiltro = 0
    this.idCategoriaFiltro = 0
    this.locaisFiltro = []
    this.categoriasFiltro = []
    this.satisfacao = 0
    this.comentarioUsuario = ''
  }

  limparParcial(): void {
    this.reserva = new ReservaRegistro()
    this.reserva.Obs = ''
    this.locais = []
    this.todosLocais = []
    this.categoria = []
    this.localDesabilitado = true
    this.catDesabilitado = true
    this.obsDesabilitado = true
    this.reserva.IdUsuario = this.idUsuario
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
    this.locais.push({
      Id: 0, Nome: '--Escolha um local--', Reservavel: false,
      Disponivel: true, Tipo: TIPOLOCAL.SALA, TipoLocal: '', TipoReservavel: '', TipoDisponivel: '',
      Comentario: ''
    })
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

    this.spinnerIniciaReservas = true
    let dia = String(100 + this.ngbDate.day).substr(1, 2);
    let mes = String(100 + this.ngbDate.month).substr(1, 2);

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

    let liberado = 0

    this.localService.getDisponibilidade(this.reserva.Data, this.reserva.Horario, this.reserva.Turno)
      .subscribe(response => {
        if (response === undefined) {
          this.mostraErro('Não foi possível consultar a disponibilidade de locais. Verifique conexão com Internet.')
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
        liberado = liberado + 1
        if (liberado == 2) {
          this.spinnerIniciaReservas = false
          this.obsDesabilitado = false
        }
      });

    this.categoriaService.getDisponibilidade(this.reserva.Data, this.reserva.Horario, this.reserva.Turno)
      .subscribe(response => {
        if (response === undefined) {
          this.mostraErro('Não foi possível consultar a disponibilidade de equipamentos. Verifique conexão com Internet.')
          this.limparParcial()
        }
        else if (response.Status == 0) {
          this.categoria = []
          this.categoria.push({ Id: 0, Nome: '--Sem equipamento--', Comentario: '' })
          this.reserva.IdCategoria = 0
          this.categoria.push.apply(this.categoria, response.Elementos)
          this.catDesabilitado = false
        }
        else {
          this.mostraErro(response.Detalhes)
          this.limparParcial()
        }
        liberado = liberado + 1
        if (liberado == 2) {
          this.spinnerIniciaReservas = false
          this.obsDesabilitado = false
        }
      });
  }

  getReservas(): void {
    this.spinnerReservas = true
    this.reservaService.getPorUsuario(this.idUsuario)
      .subscribe(response => {
        if (response === undefined) {
          this.mostraErro('Não foi possível consultar as reservas. Verifique conexão com Internet.')
        }
        else if (response.Status == 0) {
          this.reservas = response.Elementos
          this.reservas.forEach(r => {
            r.TurnoExtenso = Reserva.turnoExtenso(r.Turno)
            r.NumDataHorarioTurno = Reserva.numDataHorarioTurno(r.Data, r.Horario, r.Turno)
            r.Data = moment(r.Data, 'DD/MM/YYYY').format('ddd').toUpperCase() + ' ' + r.Data
            $(function () {
              $('[data-toggle="tooltip"]').tooltip()
            })
          })
          this.reservasExibidas = []
          this.reservas.forEach(r => this.reservasExibidas.push(r))
          this.filtrar()
        }
        else {
          this.mostraErro(response.Detalhes)
        }
        this.spinnerReservas = false
      });
  }

  reservar(): void {
    if (this.reserva.IdLocal == 0) {
      this.mostraErro('Escolha um local.')
      return
    }

    this.reservaService.addReserva(this.reserva)
      .subscribe(response => {
        if (response === undefined) {
          this.mostraErro('Não foi possível realizar a reserva solicitada. Verifique conexão com Internet.')
        }
        else if (response.Status == 0) {
          this.getReservas()
          this.limparTotal()
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  remover(index): void {
    if (confirm('Confirma remoção de ' + this.reservas[index].Data + ' ' + this.reservas[index].NomeLocal + '?')) {
      let id = this.reservas[index].Id
      this.reservaService.deleteReserva(id)
        .subscribe(response => {
          if (response === undefined) {
            this.mostraErro('Não foi possível realizar a remoção da reserva. Verifique conexão com a Internet.')
          }
          else if (response.Status == 0) {
            this.getReservas();
          }
          else {
            this.mostraErro(response.Detalhes)
          }
        });
    }
  }

  editar(index): void {
    $('#modalDetalhes').modal('show')
    this.indexDetalhe = index
    this.obsDetalhe = this.reservas[index].Obs
    this.nomeDetalhe = this.reservas[index].NomeUsuario
    this.emailDetalhe = this.reservas[index].EmailUsuario
    this.reservadoDetalhe = this.reservas[index].ReservadoEm
    this.idDetalhe = this.reservas[index].Id
  }

  atualizar(): void {
    this.reservaService.atualizarObs(this.idDetalhe, this.obsDetalhe)
      .subscribe(response => {
        if (response === undefined) {
          $('#modalDetalhes').modal('hide')
          this.mostraErro('Não foi possível atualizar observação. Verifique conexão com Internet.')
        }
        else if (response.Status == 0) {
          this.getReservas()
          $('#modalDetalhes').modal('hide')
        }
        else {
          $('#modalDetalhes').modal('hide')
          this.mostraErro(response.Detalhes)
        }
      });
  }

  abrirAvaliacao(index): void {
    $('#modalAvaliar').modal('show')
    this.indexAvaliacao = index
    this.comentarioUsuario = this.reservas[index].ComentarioUsuario
    this.satisfacao = this.reservas[index].Satisfacao
    this.idAvaliacao = this.reservas[index].Id
  }

  avaliar(): void {
    if (this.satisfacao == 0) {
      $('#modalAvaliar').modal('hide')
      this.mostraErro('Informe a sua avaliação.')
      return
    }
    if (this.comentarioUsuario === null || this.comentarioUsuario === undefined) {
      this.comentarioUsuario = ''
    }

    this.reservaService.atualizarAvaliacao(this.idAvaliacao, this.satisfacao, this.comentarioUsuario)
      .subscribe(response => {
        if (response === undefined) {
          $('#modalAvaliar').modal('hide')
          this.mostraErro('Não foi possível atualizar avaliação. Verifique conexão com Internet.')
        }
        else if (response.Status == 0) {
          this.getReservas()
          $('#modalAvaliar').modal('hide')
        }
        else {
          $('#modalAvaliar').modal('hide')
          this.mostraErro(response.Detalhes)
        }
      });
  }

  abrirFiltro(): void {
    if (this.locaisFiltro.length == 0) {
      this.localService.getLocais()
        .subscribe(response => {
          if (response === undefined) {
            this.mostraErro('Não foi possível consultar locais. Verifique conexão com Internet.')
          }
          else if (response.Status == 0) {
            this.locaisFiltro = []
            this.locaisFiltro.push({
              Id: 0, Nome: '', Reservavel: false, Disponivel: false,
              Tipo: TIPOLOCAL.SALA, TipoLocal: '', TipoReservavel: '', TipoDisponivel: '', Comentario: ''
            })
            this.locaisFiltro.push.apply(this.locaisFiltro, response.Elementos)
          }
          else {
            this.mostraErro(response.Detalhes)
          }
        });
    }

    if (this.categoriasFiltro.length == 0) {
      this.categoriaService.getCategorias()
        .subscribe(response => {
          if (response === undefined) {
            this.mostraErro('Não foi possível consultar equipamentos. Verifique conexão com Internet.')
          }
          else if (response.Status == 0) {
            this.categoriasFiltro = []
            this.categoriasFiltro.push({ Id: 0, Nome: '', Comentario: '' })
            this.categoriasFiltro.push.apply(this.categoriasFiltro, response.Elementos)
          }
          else {
            this.mostraErro(response.Detalhes)
          }
        });
    }
    $('#modalFiltro').modal('show')
  }

  filtrar(): void {
    if (this.ngbDateDe == null) this.ngbDateDe = undefined
    if (this.ngbDateAte == null) this.ngbDateAte = undefined
    if (this.obsFiltro !== undefined && this.obsFiltro !== null && this.obsFiltro.length == 0) this.obsFiltro = undefined
    this.descricaoFiltro = ''
    this.reservasExibidas = []
    this.reservasExibidas.push.apply(this.reservasExibidas, this.reservas)

    //Formata De
    let numDataTurnoHorarioDe = 0
    if (this.ngbDateDe !== undefined) {
      let diaDe = String(100 + this.ngbDateDe.day).substr(1, 2)
      let mesDe = String(100 + this.ngbDateDe.month).substr(1, 2)
      let dataDe = this.ngbDateDe.year + mesDe + diaDe

      if (this.horarioDe === undefined) {
        this.horarioDe = '1'
      }
      numDataTurnoHorarioDe = parseInt(dataDe + this.horarioDe)

      this.descricaoFiltro += 'De ' + dataDe + ' ' + Reserva.horarioTurno(parseInt(this.horarioDe))
    }

    //Formata Até
    let numDataTurnoHorarioAte = Infinity
    if (this.ngbDateAte !== undefined) {
      let diaAte = String(100 + this.ngbDateAte.day).substr(1, 2)
      let mesAte = String(100 + this.ngbDateAte.month).substr(1, 2)
      let dataAte = this.ngbDateAte.year + mesAte + diaAte
      if (this.horarioAte === undefined) {
        this.horarioAte = '8'
      }
      numDataTurnoHorarioAte = parseInt(dataAte + this.horarioAte)
      if (this.descricaoFiltro.length > 0) {
        this.descricaoFiltro += ' até ' + dataAte + ' ' + Reserva.horarioTurno(parseInt(this.horarioAte))
      }
      else {
        this.descricaoFiltro += 'Até ' + dataAte + ' ' + Reserva.horarioTurno(parseInt(this.horarioAte))
      }
    }

    this.reservasExibidas = this.reservasExibidas.filter(r =>
      r.NumDataHorarioTurno >= numDataTurnoHorarioDe && r.NumDataHorarioTurno <= numDataTurnoHorarioAte)

    if (this.idLocalFiltro > 0) {
      this.reservasExibidas = this.reservasExibidas.filter(r => r.IdLocal == this.idLocalFiltro)
      if (this.descricaoFiltro.length > 0) {
        this.descricaoFiltro += ', no local ' + this.locaisFiltro.find(l => l.Id == this.idLocalFiltro).Nome
      }
      else {
        this.descricaoFiltro += 'No local ' + this.locaisFiltro.find(l => l.Id == this.idLocalFiltro).Nome
      }
    }

    if (this.idCategoriaFiltro > 0) {
      this.reservasExibidas = this.reservasExibidas.filter(r => r.IdEquipamentos.find(e => e == this.idCategoriaFiltro) != undefined)
      if (this.descricaoFiltro.length > 0) {
        this.descricaoFiltro += ', com equipamento ' + this.categoriasFiltro.find(l => l.Id == this.idCategoriaFiltro).Nome
      }
      else {
        this.descricaoFiltro += 'Com equipamento ' + this.categoriasFiltro.find(l => l.Id == this.idCategoriaFiltro).Nome
      }
    }

    if (this.obsFiltro !== undefined) {
      this.reservasExibidas = this.reservasExibidas.filter(r => r.Obs.includes(this.obsFiltro, 0))
      if (this.descricaoFiltro.length > 0) {
        this.descricaoFiltro += ', contendo na observação ' + this.obsFiltro
      }
      else {
        this.descricaoFiltro += 'Contendo na observação ' + this.obsFiltro
      }
    }

    $('#modalFiltro').modal('hide')
  }

  limparFiltro(): void {
    this.ngbDateDe = undefined
    this.ngbDateAte = undefined
    this.horarioDe = undefined
    this.horarioAte = undefined
    this.idLocalFiltro = 0
    this.idCategoriaFiltro = 0
    this.obsFiltro = undefined
    this.filtrar()
  }

  mostraErro(detalhe): void {
    this.erroDetalhe = detalhe
    $('#modalErro').modal('show')
  }
}