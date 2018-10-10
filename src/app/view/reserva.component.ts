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
  titulo: string;
  reserva: ReservaRegistro;
  ngbDate: NgbDateStruct;
  horario: number;
  somenteLabs : boolean;
  localDesabilitado: boolean;
  cat1Desabilitado: boolean;
  cat2Desabilitado: boolean;
  reservas: Reserva[];
  locais: Local[];
  todosLocais: Local[];
  categoria1: Categoria[];
  categoria2: Categoria[];

  erroDetalhe: string;

  constructor(private localService: LocalService, private categoriaService: CategoriaService) { }

  ngOnInit() {
    this.titulo = 'Cadastrar Novo'
    this.limparTotal()
  }

  limparParcial(): void{
    this.reserva = new ReservaRegistro()
    this.locais = []
    this.todosLocais = []
    this.categoria1 = []
    this.categoria2 = []
    this.localDesabilitado = true
    this.cat1Desabilitado = true
    this.cat2Desabilitado = true
  }

  limparTotal(): void{
    this.limparParcial()
    this.horario = 0
  }

  onChangeHorario() {
    this.iniciarReserva()
  }

  onChangeSomenteLabs(){
    this.locais = []
    this.locais.push({Id:0, Nome:'--Escolha um local--', Reservavel:false, Disponivel:true, Tipo:0})
    if (this.somenteLabs) {
      this.locais.push.apply(this.locais, this.todosLocais.filter(l => l.Tipo == 0))
    }
    else {
      this.locais.push.apply(this.locais, this.todosLocais)
    }
  }

  //Adiciona as categorias no 2o select, com exceção da categoria escolhida no 1o
  onChangeCat1() {
    this.categoria2 = []
    this.categoria2.push({Id:0,Nome:'--Escolha um equipamento--'})
    this.reserva.IdEquipamento2 = 0
    this.categoria2.push.apply(this.categoria2, this.categoria1.filter(c => c.Id != this.reserva.IdEquipamento1))
    this.cat2Desabilitado = false
  }

  onChangeCat2() {
    
  }

  //Consulta disponibilidade de locais e equipamentos
  iniciarReserva(): void {
    this.limparParcial()

    if (this.ngbDate === undefined || this.horario == 0){
      return;
    }

    let dia = String(100 + this.ngbDate.day).substring(1,3);
    let mes = String(100 + this.ngbDate.month).substring(1,3);

    this.reserva.Data = dia + '/' + mes + '/' + this.ngbDate.year

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
        this.limparParcial()
      }
      else if (response.Status == 0) {
        this.todosLocais = []
        this.todosLocais.push.apply(this.locais, response.Locais)
        
        this.locais = []
        this.locais.push({Id:0,Nome:'--Escolha um local--',Reservavel:false,Disponivel:true,Tipo:0})
        this.reserva.IdLocal = 0
        
        this.localDesabilitado = false
      }
      else {
        this.mostraErro(response.Detalhes)
        this.limparParcial()
      }
    });

    this.categoriaService.getDisponibilidade(this.reserva.Data, this.reserva.Horario, this.reserva.Turno)
    .subscribe(response => {
      if (response === undefined){
        this.mostraErro('Não foi possível consultar a disponibilidade de equipamentos.')
        this.limparParcial()
      }
      else if (response.Status == 0) {
        this.categoria1 = []
        this.categoria1.push({Id:0,Nome:'--Escolha um equipamento--'})
        this.reserva.IdEquipamento1 = 0
        this.categoria1.push.apply(this.categoria1, response.Categorias)
        this.cat1Desabilitado = false
      }
      else {
        this.mostraErro(response.Detalhes)
        this.limparParcial()
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