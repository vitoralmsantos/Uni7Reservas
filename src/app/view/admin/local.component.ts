import { Component, OnInit } from '@angular/core';
import { Local } from '../../model/local.model';
import { LocalService } from '../../services/local.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'uni7res-local',
  templateUrl: './local.component.html',
  styleUrls: ['./local.component.css']
})
export class LocalComponent implements OnInit {
  locais: Local[];
  local: Local;
  erroDetalhe: string;
  selectedIndex: number;

  constructor(private localService: LocalService) { }

  ngOnInit() {
    this.getLocais();
    this.limpar();
  }
 
  getLocais(): void {
    this.localService.getLocais()
      .subscribe(response => {
        if (response.Status == 0) {
          this.locais = response.Elementos
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  getLocal(id): void {
    this.localService.getLocal(id)
      .subscribe(response => { this.local = response.Elemento });
  }


  limpar(): void {
    this.local = new Local()
    this.local.Reservavel = false
    this.local.Disponivel = false
  }

  inserir(): void {
    this.localService.addLocal(this.local)
      .subscribe(response => {
        if (response === undefined){
          this.mostraErro('Não foi possível realizar o cadastro do usuário.')
        }
        else if (response.Status == 0) {
          this.limpar()
          this.getLocais();
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  atualizar(): void {
    this.localService.updateLocal(this.local)
      .subscribe(response => {
        if (response.Status == 0) {
          this.locais[this.selectedIndex].Nome = this.local.Nome;
          this.locais[this.selectedIndex].Reservavel = this.local.Reservavel;
          this.locais[this.selectedIndex].Disponivel = this.local.Disponivel;
          this.locais[this.selectedIndex].Tipo = this.local.Tipo;
          this.limpar()
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  remover(index): void {
    if (confirm('Confirma remoção de ' + this.locais[index].Nome)) {
      let id = this.locais[index].Id
      this.localService.deleteLocal(id)
      .subscribe(response => {
        if (response === undefined){
          this.mostraErro('Não foi possível realizar a remoção do local.')
        }
        else if (response.Status == 0) {
          this.limpar()
          this.getLocais();
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
    }
  }

  carregar(index): void {
    this.selectedIndex = index
    this.local.Id = this.locais[index].Id
    this.local.Nome = this.locais[index].Nome
    this.local.Reservavel = this.locais[index].Reservavel
    this.local.Disponivel = this.locais[index].Disponivel
    this.local.Tipo = this.locais[index].Tipo

  }

  registrar(): void {
    if (this.local.Nome === undefined || this.local.Nome === ''){
      this.mostraErro('Digite o nome do local.')
      return
    }
    if (this.local.Tipo == -1){
      this.mostraErro('Escolha um tipo de local.')
      return
    }
    if (this.local.Id === undefined) {
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
