import { Component, OnInit } from '@angular/core';
import { Chamado } from '../../model/chamado.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ChamadoService } from 'src/app/services/chamado.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'uni7res-software',
  templateUrl: './chamado.component.html',
  styleUrls: ['./chamado.component.css']
})
export class ChamadoComponent implements OnInit {

  chamados: Chamado[];
  chamado: Chamado;
  ngbDate: NgbDateStruct;
  erroDetalhe: string;
  selectedIndex: number;

  constructor(private chamadoService: ChamadoService) { }

  ngOnInit() {
    this.getChamados();
    this.limpar();
  }

  getChamados(): void {
    this.chamadoService.getChamados()
      .subscribe(response => {
        if (response.Status == 0) {
          this.chamados = response.Elementos
        }
        else {
          this.mostraErro(response.Status)
        }
      });
  }

  getChamado(id): void {
    this.chamadoService.getChamado(id)
      .subscribe(response => { this.chamado = response.Elemento });
  }

  
  inserir(): void {
    this.chamadoService.addChamado(this.chamado)
      .subscribe(response => {
        if (response === undefined){
          this.mostraErro('Não foi possível realizar o cadastro do chamado.')
        }
        else if (response.Status == 0) {
          this.limpar()
          this.getChamados();
        }
        else {
          this.mostraErro(response.Status)
        }
      });
  }

  atualizar(): void {
    this.chamadoService.updateChamado(this.chamado)
      .subscribe(response => {
        if (response === undefined){
          this.mostraErro('Não foi possível realizar a atualização do chamado.')
        }
        else if (response.Status == 0) {
          this.chamados[this.selectedIndex].Descricao = this.chamado.Descricao;
          this.chamados[this.selectedIndex].Status = this.chamado.Status;
          this.chamados[this.selectedIndex].Observacoes = this.chamado.Observacoes;
          this.chamados[this.selectedIndex].DataLimite = this.chamado.DataLimite;
          this.chamados[this.selectedIndex].DataPrevista = this.chamado.DataPrevista;
          this.chamados[this.selectedIndex].Telefone = this.chamado.Telefone;
          this.limpar()
        }
        else {
          this.mostraErro(response.Status)
        }
      });
  }

  
  remover(index): void {
    if (confirm('Confirma remoção de ' + this.chamados[index].Descricao)) {
      let id = this.chamados[index].Id
      this.chamadoService.deleteChamado(id)
      .subscribe(response => {
        if (response === undefined){
          this.mostraErro('Não foi possível realizar a remoção do chamado.')
        }
        else if (response.Status == 0) {
          this.limpar()
          this.getChamados();
        }
        else {
          this.mostraErro(response.Status)
        }
      });
    }
  }

  carregar(index): void {
    this.selectedIndex = index
    this.chamado.Id = this.chamados[index].Id
    this.chamado.Descricao = this.chamados[index].Descricao
    this.chamado.Status = this.chamados[index].Status
    this.chamado.Observacoes = this.chamados[index].Observacoes
    this.chamado.DataLimite = this.chamados[index].DataLimite
  }

  limpar(): void {
    this.chamado = new Chamado()
  }

  registrar(): void {
    if (this.chamado.Descricao === undefined || this.chamado.Descricao === ''){
      this.mostraErro('Digite a descrição do chamado.')
      return
    }
    if (this.chamado.Status === undefined){
      this.mostraErro('Digite o estado do chamado.')
      return
    }
    if (this.chamado.Observacoes == ''){
      this.mostraErro('Digite a observação do chamado.')
      return
    }
    
    if (this.chamado.Id === undefined) {
      this.inserir()
    }
    else {
      this.atualizar()
    }
  }

  mostraErro(detalhe): void {
    this.erroDetalhe = detalhe
    $('#modalErro').modal('show')
  }

}
