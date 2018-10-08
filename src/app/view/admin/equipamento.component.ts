import { Component, OnInit } from '@angular/core';
import { EquipamentoService } from '../../services/equipamento.service';
import { Equipamento } from '../../model/equipamento.model';
import { Categoria } from '../../model/categoria.model';
import { CategoriaService } from '../../services/categoria.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'uni7res-equipamento',
  templateUrl: './equipamento.component.html',
  styleUrls: ['./equipamento.component.css']
})
export class EquipamentoComponent implements OnInit {
  equipamentos: Equipamento[];
  equipamento: Equipamento;
  erroDetalhe: string;
  selectedIndex: number;
  categorias: Categoria[];

  constructor(private equipamentoService: EquipamentoService, private categoriaService: CategoriaService) { }

  ngOnInit() {
    this.getEquipamentos();
    this.limpar();
    this.getCategoria();
  }

  getCategoria(): void {
    this.categoriaService.getCategorias()
      .subscribe(response => {
      if (response.Status == 0) {
        this.categorias = response.Categorias
      }
      else {
        this.mostraErro(response.Detalhes)
      }
    });
  }

  getEquipamentos(): void {
    this.equipamentoService.getEquipamentos()
      .subscribe(response => {
        if (response.Status == 0) {
          this.equipamentos = response.Equipamentos
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  getEquipamento(id): void {
    this.equipamentoService.getEquipamento(id)
      .subscribe(response => { this.equipamento = response.Equipamento });
  }

  limpar(): void {
    this.equipamento = new Equipamento()
  }

  inserir(): void {
    this.equipamentoService.addEquipamento(this.equipamento)
      .subscribe(response => {
        if (response.Status == 0) {
          this.getEquipamentos();
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  atualizar(): void {
    this.equipamentoService.updateEquipamento(this.equipamento)
      .subscribe(response => {
        if (response.Status == 0) {
          this.equipamentos[this.selectedIndex].Modelo = this.equipamento.Modelo;
          this.equipamentos[this.selectedIndex].Disponivel = response.Equipamento.Disponivel;
          this.equipamentos[this.selectedIndex].IdCategoria = response.Equipamento.IdCategoria;
          this.equipamentos[this.selectedIndex].Serie = response.Equipamento.Serie;
          console.log(response.Equipamento)
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  remover(id): void {
    this.equipamentoService.deleteEquipamento(id)
      .subscribe(response => {
        if (response.Status == 0) {
          this.getEquipamentos();
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  carregar(index): void {
    this.selectedIndex = index
    this.equipamento.Id = this.equipamentos[index].Id
    this.equipamento.Modelo = this.equipamentos[index].Modelo
    this.equipamento.Disponivel = this.equipamentos[index].Disponivel
    this.equipamento.IdCategoria = this.equipamentos[index].IdCategoria
    this.equipamento.Serie = this.equipamentos[index].Serie
  }


  registrar(): void {
    if (this.equipamento.Id === undefined) {
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
