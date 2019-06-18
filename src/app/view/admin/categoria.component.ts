import { Component, OnInit } from '@angular/core';
import { Categoria } from '../../model/categoria.model';
import { CategoriaService } from '../../services/categoria.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario.model';
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
  titulo: String;

  constructor(private categoriaService: CategoriaService, private authService: AuthService, 
    private router: Router) { }

  ngOnInit() {
    if (this.authService.retrieveUserId() == '0' 
    || !Usuario.permissao(this.authService.retrieveUsuario().Tipo, '/principal/admin/categoria')) {
      this.router.navigateByUrl('/');
      return
    }

    this.getCategorias();
    this.limpar();
  }

  getCategorias(): void {
    this.categoriaService.getCategorias()
      .subscribe(response => {
        if (response.Status == 0) {
          this.categorias = response.Elementos
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  getCategoria(id): void {
    this.categoriaService.getCategoria(id)
      .subscribe(response => { this.categoria = response.Elemento });
  }

  limpar(): void {
    this.categoria = new Categoria()
    this.titulo = "Nova categoria"
    $('#headerCategoria').removeClass('bg-warning')
  }

  inserir(): void {
    this.categoriaService.addCategoria(this.categoria)
      .subscribe(response => {
        if (response === undefined){
          this.mostraErro('Não foi possível realizar o cadastro do equipamento.')
        }
        else if (response.Status == 0) {
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
        if (response === undefined){
          this.mostraErro('Não foi possível realizar a atualização do usuário.')
        }
        else if (response.Status == 0) {
          this.categorias[this.selectedIndex].Nome = this.categoria.Nome;
          this.categorias[this.selectedIndex].Comentario = this.categoria.Comentario;
          this.limpar()
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  remover(index): void {
    if (confirm('Confirma remoção de ' + this.categorias[index].Nome)) {
      let id = this.categorias[index].Id
      this.categoriaService.deleteCategoria(id)
      .subscribe(response => {
        if (response === undefined){
          this.mostraErro('Não foi possível realizar a remoção da categoria.')
        }
        else if (response.Status == 0) {
          this.limpar()
          this.getCategorias();
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
    }
  }

  carregar(index): void {
    this.selectedIndex = index
    this.categoria.Id = this.categorias[index].Id
    this.categoria.Nome = this.categorias[index].Nome
    this.categoria.Comentario = this.categorias[index].Comentario
    this.titulo = "Editar categoria"
    $('#headerCategoria').addClass('bg-warning')
  }


  registrar(): void {
    if (this.categoria.Nome === undefined || this.categoria.Nome === ''){
      this.mostraErro('Digite o nome da categoria.')
      return
    }
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