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
  titulo: string;

  constructor(private equipamentoService: EquipamentoService, private categoriaService: CategoriaService) { }

  ngOnInit() {
    this.limpar();
    this.getCategoria();
  }

  onChangeCategoria(): void {
    this.equipamento.NomeCategoria = this.categorias.find(c => c.Id == this.equipamento.IdCategoria).Nome
  }

  getCategoria(): void {
    this.categoriaService.getCategorias()
      .subscribe(response => {
      if (response.Status == 0) {
        this.categorias = response.Elementos
        this.getEquipamentos()
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
          this.equipamentos = response.Elementos
          this.equipamentos.forEach(u => u.TipoBoolean = Equipamento.TipoBoolean(u.Disponivel))
          this.equipamentos.forEach(e => e.NomeCategoria = this.categorias.find(c => c.Id == e.IdCategoria).Nome)
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  getEquipamento(id): void {
    this.equipamentoService.getEquipamento(id)
      .subscribe(response => { this.equipamento = response.Elemento });
  }

  limpar(): void {
    this.equipamento = new Equipamento()
    this.equipamento.Disponivel = false
    this.titulo = 'Novo equipamento'
    $('#headerEquipamento').removeClass('bg-warning')
  }

  inserir(): void {
    this.equipamentoService.addEquipamento(this.equipamento)
      .subscribe(response => {
        if (response === undefined){
          this.mostraErro('Não foi possível realizar o cadastro do usuário.')
        }
        else if (response.Status == 0) {
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
        if (response === undefined){
          this.mostraErro('Não foi possível realizar a atualização do equipamento.')
        }
        else if (response.Status == 0) {
          this.equipamentos[this.selectedIndex].Modelo = this.equipamento.Modelo;
          this.equipamentos[this.selectedIndex].Disponivel = this.equipamento.Disponivel;
          this.equipamentos[this.selectedIndex].IdCategoria = this.equipamento.IdCategoria;
          this.equipamentos[this.selectedIndex].Serie = this.equipamento.Serie;
          this.equipamentos[this.selectedIndex].NomeCategoria = this.equipamento.NomeCategoria;
          this.limpar()
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  remover(index): void {
    if (confirm('Confirma remoção de ' + this.equipamentos[index].Modelo)) {
      let id = this.equipamentos[index].Id
      this.equipamentoService.deleteEquipamento(id)
      .subscribe(response => {
        if (response === undefined){
          this.mostraErro('Não foi possível realizar a remoção do equipamento.')
        }
        else if (response.Status == 0) {
          this.limpar()
          this.getEquipamentos();
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
    }
  }

  carregar(index): void {
    this.selectedIndex = index
    this.equipamento.Id = this.equipamentos[index].Id
    this.equipamento.Modelo = this.equipamentos[index].Modelo
    this.equipamento.Disponivel = this.equipamentos[index].Disponivel
    this.equipamento.IdCategoria = this.equipamentos[index].IdCategoria
    this.equipamento.Serie = this.equipamentos[index].Serie
    this.titulo = 'Editar equipamento'
    $('#headerEquipamento').addClass('bg-warning')
  }


  registrar(): void {
    if (this.equipamento.Modelo === undefined || this.equipamento.Modelo === ''){
      this.mostraErro('Digite o modelo do equipamento.')
      return
    }
    if (this.equipamento.Serie === undefined || this.equipamento.Modelo === ''){
      this.mostraErro('Digite o número da serie')
    }
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
