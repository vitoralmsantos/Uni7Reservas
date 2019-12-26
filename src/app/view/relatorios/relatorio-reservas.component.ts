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
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario.model';
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
  horarioDe: string
  ngbDateAte: NgbDateStruct
  horarioAte: string
  descricaoFiltro: string
  erroDetalhe: string
  reservas: Reserva[]
  tipo: number
  spinnerReservas: boolean

  constructor(private localService: LocalService, private categoriaService: CategoriaService,
    private reservaService: ReservaService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.retrieveUserId() == '0' 
    || !Usuario.permissao(this.authService.retrieveUsuario().Tipo, '/principal/relatorios/reservas')) {
      this.router.navigateByUrl('/');
    }

    this.locaisFiltro = []
    this.categoriasFiltro = []
    this.getLocais()
    this.getEquipamentos()
    this.limparFiltro()
    this.spinnerReservas = false
  }

  limparFiltro(): void {
    this.ngbDateDe = undefined
    this.ngbDateAte = undefined
    this.horarioDe = undefined
    this.horarioAte = undefined
    this.tipo = 1
    this.idLocalFiltro = 0
    this.idCategoriaFiltro = 0
    this.obsFiltro = undefined
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
              Tipo: TIPOLOCAL.SALA, TipoLocal: '', TipoReservavel: '', TipoDisponivel: '', Comentario: ''
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
            this.categoriasFiltro.push({ Id: 0, Nome: '', Comentario: '' })
            this.categoriasFiltro.push.apply(this.categoriasFiltro, response.Elementos)
          }
          else {
            this.mostraErro(response.Detalhes)
          }
        });
    }
  }

  filtrar(): void {
    this.spinnerReservas = true
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

    if (this.obsFiltro === undefined) this.obsFiltro = ''

    this.reservaService.getPorFiltro(dataDe, dataAte, this.tipo, this.idLocalFiltro, this.idCategoriaFiltro, this.obsFiltro)
      .subscribe(response => {
        if (response === undefined) {
          this.mostraErro('Não foi possível consultar reservas. Verifique conexão com Internet.')
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

          this.descricaoFiltro = ''

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

            this.descricaoFiltro += 'De ' + diaDe + '/' + mesDe + '/' + this.ngbDateDe.year + ' ' + 
              Reserva.horarioTurno(parseInt(this.horarioDe))
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
              this.descricaoFiltro += ', até ' + diaAte + '/' + mesAte + '/' + this.ngbDateAte.year + ' ' + 
                Reserva.horarioTurno(parseInt(this.horarioAte))
            }
            else {
              this.descricaoFiltro += 'Até ' + diaAte + '/' + mesAte + '/' + this.ngbDateAte.year + ' ' + 
                Reserva.horarioTurno(parseInt(this.horarioAte))
            }
          }

          this.reservas = this.reservas.filter(r =>
            r.NumDataHorarioTurno >= numDataTurnoHorarioDe && r.NumDataHorarioTurno <= numDataTurnoHorarioAte)

          if (this.tipo == 1) {
            if (this.descricaoFiltro.length == 0) {
              this.descricaoFiltro += 'De laboratórios'
            }
            else {
              this.descricaoFiltro += ', de laboratórios'
            }
          }
          else if (this.tipo == 2) {
            if (this.descricaoFiltro.length == 0) {
              this.descricaoFiltro += 'De equipamentos'
            }
            else {
              this.descricaoFiltro += ', de equipamentos'
            }
          }
          else if (this.tipo == 3) {
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
          }

          if (this.obsFiltro.length > 0) {
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
        this.spinnerReservas = false
      });
  }

  imprimir(): void {
    let printContents, popupWin;
    printContents = document.getElementById('reservasParaImprimir').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Relatório de reservas</title>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  mostraErro(detalhe): void {
    this.erroDetalhe = detalhe
    $('#modalErro').modal('show')
  }

}
