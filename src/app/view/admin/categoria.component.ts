import { Component, OnInit } from '@angular/core';
import { Categoria } from '../../model/categoria.model';
import { CategoriaService } from '../../services/categoria.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'uni7res-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  categorias: Categoria[];
  categoria: Categoria;
  erroDetalhe: string;
  selectedIndex: number;

  constructor(private categoriaService: CategoriaService) { }

  ngOnInit() {
    this.getCategorias();
    this.limpar();
  }

  getCategorias(): void {
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

  getCategoria(id): void {
    this.categoriaService.getCategoria(id)
      .subscribe(response => { this.categoria = response.Categoria });
  }

  limpar(): void {
    this.categoria = new Categoria()
  }

  inserir(): void {
    this.categoriaService.addCategoria(this.categoria)
      .subscribe(response => {
        if (response.Status == 0) {
          this.getCategorias();
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  atualizar(): void {
    this.categoriaService.updateCategoria(this.categoria)
      .subscribe(response => {
        if (response.Status == 0) {
          this.categorias[this.selectedIndex].Nome = response.Categoria.Nome;

        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  remover(id): void {
    this.categoriaService.deleteCategoria(id)
      .subscribe(response => {
        if (response.Status == 0) {
          this.getCategorias();
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  carregar(index): void {
    this.selectedIndex = index
    this.categoria.Id = this.categorias[index].Id
    this.categoria.Nome = this.categorias[index].Nome

  }


  registrar(): void {
    if (this.categoria.Id === undefined) {
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