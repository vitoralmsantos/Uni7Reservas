import { Component, OnInit } from '@angular/core';
import { Recurso } from '../../model/recurso.model';
import { RecursoService } from '../../services/recurso.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'uni7res-software',
  templateUrl: './recurso.component.html',
  styleUrls: ['./recurso.component.css']
})
export class RecursoComponent implements OnInit {

  recursos: Recurso[];
  recurso: Recurso;
  ngbDate: NgbDateStruct;
  erroDetalhe: string;
  selectedIndex: number;

  constructor(private recursoService: RecursoService) { }

  ngOnInit() {
    this.getRecursos();
    this.limpar();
  }

  getRecursos(): void {
    this.recursoService.getRecursos()
      .subscribe(response => {
        if (response.Status == 0) {
          this.recursos = response.Elementos
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  getRecurso(id): void {
    this.recursoService.getRecurso(id)
      .subscribe(response => { this.recurso = response.Elemento });
  }

  
  inserir(): void {
    this.recursoService.addRecurso(this.recurso)
      .subscribe(response => {
        if (response === undefined){
          this.mostraErro('Não foi possível realizar o cadastro do usuário.')
        }
        else if (response.Status == 0) {
          this.limpar()
          this.getRecursos();
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  atualizar(): void {
    this.recursoService.updateRecurso(this.recurso)
      .subscribe(response => {
        if (response === undefined){
          this.mostraErro('Não foi possível realizar a atualização do usuário.')
        }
        else if (response.Status == 0) {
          this.recursos[this.selectedIndex].Nome = this.recurso.Nome;
          this.recursos[this.selectedIndex].Detalhes = this.recurso.Detalhes;
          this.recursos[this.selectedIndex].Tipo = this.recurso.Tipo;
          this.recursos[this.selectedIndex].Vencimento = this.recurso.Vencimento
          this.limpar()
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  
  remover(index): void {
    if (confirm('Confirma remoção de ' + this.recursos[index].Nome)) {
      let id = this.recursos[index].Id
      this.recursoService.deleteRecurso(id)
      .subscribe(response => {
        if (response === undefined){
          this.mostraErro('Não foi possível realizar a remoção do recurso.')
        }
        else if (response.Status == 0) {
          this.limpar()
          this.getRecursos();
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
    }
  }

  carregar(index): void {
    this.selectedIndex = index
    this.recurso.Id = this.recursos[index].Id
    this.recurso.Nome = this.recursos[index].Nome
    this.recurso.Detalhes = this.recursos[index].Detalhes
    this.recurso.Tipo = this.recursos[index].Tipo
    this.recurso.Vencimento = this.recursos[index].Vencimento
  }

  limpar(): void {
    this.recurso = new Recurso()
  }

  registrar(): void {
    if (this.recurso.Nome === undefined || this.recurso.Nome === ''){
      this.mostraErro('Digite o nome do recurso.')
      return
    }
    if (this.recurso.Detalhes === undefined || this.recurso.Detalhes === ''){
      this.mostraErro('Digite os detalhes do recurso.')
      return
    }
    if (this.recurso.Tipo == -1){
      this.mostraErro('Escolha um tipo de recurso.')
      return
    }
    
    if (this.recurso.Id === undefined) {
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
