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
          this.locais = response.Locais
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  getLocal(id): void {
    this.localService.getLocal(id)
      .subscribe(response => { this.local = response.Local });
  }


  limpar(): void {
    this.local = new Local()
  }

  inserir(): void {
    this.localService.addLocal(this.local)
      .subscribe(response => {
        if (response.Status == 0) {
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
          this.locais[this.selectedIndex].Nome = response.Local.Nome;
          this.locais[this.selectedIndex].Reservavel = response.Local.Reservavel;
          this.locais[this.selectedIndex].Disponivel = response.Local.Disponivel;
          this.locais[this.selectedIndex].Tipo = response.Local.Tipo;

        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  remover(id): void {
    this.localService.deleteLocal(id)
      .subscribe(response => {
        if (response.Status == 0) {
          this.getLocais();
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
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
