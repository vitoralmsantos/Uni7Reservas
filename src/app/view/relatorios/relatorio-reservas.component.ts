import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../model/reserva.model';
import { ReservaRegistro } from '../../model/reservaregistro.model';
import { Local, TIPOLOCAL } from '../../model/local.model';
import { Categoria } from '../../model/categoria.model';
import { LocalService } from '../../services/local.service';
import { CategoriaService } from '../../services/categoria.service';
import { ReservaService } from '../../services/reserva.service';
import { AuthService } from '../../services/auth.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import 'moment/locale/pt-br';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'uni7res-relatorio-reservas',
  templateUrl: './relatorio-reservas.component.html',
  styleUrls: ['./relatorio-reservas.component.css']
})
export class RelatorioReservasComponent implements OnInit {

  categoriasFiltro: Categoria[]
  locaisFiltro: Local[]
  obsFiltro: string
  idLocalFiltro: number
  idCategoriaFiltro: number
  ngbDateDe: NgbDateStruct
  horarioDe: number
  ngbDateAte: NgbDateStruct
  horarioAte: number
  descricaoFiltro: string
  erroDetalhe: string
  reservas: Reserva[]

  constructor(private localService: LocalService, private categoriaService: CategoriaService,
    private reservaService: ReservaService, private authService: AuthService) { }

  ngOnInit() {
    this.locaisFiltro = []
    this.categoriasFiltro = []
    this.getLocais()
    this.getEquipamentos()
    this.limparFiltro()
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

  getLocais(): void {
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
              Tipo: TIPOLOCAL.SALA, TipoLocal: '', TipoReservavel: '', TipoDisponivel: '', ComentarioReserva: ''
            })
            this.locaisFiltro.push.apply(this.locaisFiltro, response.Elementos)
          }
          else {
            this.mostraErro(response.Detalhes)
          }
        });
    }
  }

  getEquipamentos(): void {
    if (this.categoriasFiltro.length == 0) {
      this.categoriaService.getCategorias()
        .subscribe(response => {
          if (response === undefined) {
            this.mostraErro('Não foi possível consultar equipamentos. Verifique conexão com Internet.')
          }
          else if (response.Status == 0) {
            this.categoriasFiltro = []
            this.categoriasFiltro.push({ Id: 0, Nome: '', ComentarioReserva: '' })
            this.categoriasFiltro.push.apply(this.categoriasFiltro, response.Elementos)
          }
          else {
            this.mostraErro(response.Detalhes)
          }
        });
    }
  }

  filtrar(): void {
    let dataDe = ''
    let dataAte = ''

    if (this.ngbDateDe == null) this.ngbDateDe = undefined
    if (this.ngbDateAte == null) this.ngbDateAte = undefined

    if (this.ngbDateDe !== undefined) {
      let diaDe = String(100 + this.ngbDateDe.day).substr(1, 2);
      let mesDe = String(100 + this.ngbDateDe.month).substr(1, 2);
      dataDe = diaDe + '/' + mesDe + '/' + this.ngbDateDe.year
    }

    if (this.ngbDateAte !== undefined) {
      let diaAte = String(100 + this.ngbDateAte.day).substr(1, 2);
      let mesAte = String(100 + this.ngbDateAte.month).substr(1, 2);
      dataAte = diaAte + '/' + mesAte + '/' + this.ngbDateAte.year
    }

    this.reservaService.getPorFiltro(dataDe, dataAte)
      .subscribe(response => {
        if (response === undefined) {
          this.mostraErro('Não foi possível consultar reservas. Verifique conexão com Internet.')
        }
        else if (response.Status == 0) {

          if (this.obsFiltro !== undefined && this.obsFiltro !== null && this.obsFiltro.length == 0) this.obsFiltro = undefined
          this.descricaoFiltro = ''

          //Formata De
          let numDataTurnoHorarioDe = 0
          if (this.ngbDateDe !== undefined) {
            let diaDe = String(100 + this.ngbDateDe.day).substr(1, 2)
            let mesDe = String(100 + this.ngbDateDe.month).substr(1, 2)
            let dataDe = diaDe + '/' + mesDe + '/' + this.ngbDateDe.year
            numDataTurnoHorarioDe = Reserva.numDataHorarioTurno(dataDe, '', '')
            if (this.horarioDe === undefined) {
              this.horarioDe = 1
            }
            numDataTurnoHorarioDe = numDataTurnoHorarioDe + this.horarioDe

            this.descricaoFiltro += 'De ' + dataDe + ' ' + Reserva.horarioTurno(this.horarioDe)
          }

          //Formata Até
          let numDataTurnoHorarioAte = Infinity
          if (this.ngbDateAte !== undefined) {
            let diaAte = String(100 + this.ngbDateAte.day).substr(1, 2)
            let mesAte = String(100 + this.ngbDateAte.month).substr(1, 2)
            let dataAte = diaAte + '/' + mesAte + '/' + this.ngbDateAte.year
            numDataTurnoHorarioAte = Reserva.numDataHorarioTurno(dataAte, '', '')
            if (this.horarioAte === undefined) {
              this.horarioAte = 1
            }
            numDataTurnoHorarioAte = numDataTurnoHorarioAte + this.horarioAte
            if (this.descricaoFiltro.length > 0) {
              this.descricaoFiltro += ', até ' + dataAte + ' ' + Reserva.horarioTurno(this.horarioAte)
            }
            else {
              this.descricaoFiltro += 'Até ' + dataAte + ' ' + Reserva.horarioTurno(this.horarioAte)
            }
          }

          if (this.idLocalFiltro > 0) {
            if (this.descricaoFiltro.length > 0) {
              this.descricaoFiltro += ', no local ' + this.locaisFiltro.find(l => l.Id == this.idLocalFiltro).Nome
            }
            else {
              this.descricaoFiltro += 'No local ' + this.locaisFiltro.find(l => l.Id == this.idLocalFiltro).Nome
            }
          }

          if (this.idCategoriaFiltro > 0) {
            if (this.descricaoFiltro.length > 0) {
              this.descricaoFiltro += ', com equipamento ' + this.categoriasFiltro.find(l => l.Id == this.idCategoriaFiltro).Nome
            }
            else {
              this.descricaoFiltro += 'Com equipamento ' + this.categoriasFiltro.find(l => l.Id == this.idCategoriaFiltro).Nome
            }
          }

          if (this.obsFiltro !== undefined) {
            this.reservas = this.reservas.filter(r => r.Obs.includes(this.obsFiltro, 0))
            if (this.descricaoFiltro.length > 0) {
              this.descricaoFiltro += ', contendo na observação ' + this.obsFiltro
            }
            else {
              this.descricaoFiltro += 'Contendo na observação ' + this.obsFiltro
            }
          }
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
