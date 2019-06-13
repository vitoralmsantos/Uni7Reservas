import { Component, OnInit } from '@angular/core';
import { Local } from '../../model/local.model';
import { Categoria } from '../../model/categoria.model';
import { LocalService } from '../../services/local.service';
import { CategoriaService } from '../../services/categoria.service';
import { Usuario } from 'src/app/model/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'uni7res-local',
  templateUrl: './local.component.html',
  styleUrls: ['./local.component.css']
})
export class LocalComponent implements OnInit {
  locais: Local[]
  local: Local
  erroDetalhe: string
  selectedIndex: number
  titulo: string
  restricoes: Categoria[]
  naorestricoes: Categoria[]
  naorestricaoId: number
  spinnerRestricoes: boolean
  localRestricao: string

  constructor(private localService: LocalService, private categoriaService: CategoriaService, 
    private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.retrieveUserId() == '0' 
    || !Usuario.permissao(this.authService.retrieveUsuario().Tipo, '/principal/admin/local')) {
      this.router.navigateByUrl('/');
    }

    this.getLocais();
    this.limpar();
    this.spinnerRestricoes = false
    this.localRestricao = ''
    this.restricoes = []
    this.naorestricoes = []
  }

  tipoLocal(local: Local): String {
    return Local.tipoLocal(local.Tipo)
  }

  tipoDisponivel(local: Local): String {
    return Local.tipoDisponivel(local.Disponivel)
  }

  tipoBoolean(local: Local): String {
    return Local.tipoReservavel(local.Reservavel)
  }

  getLocais(): void {
    this.localService.getLocais()
      .subscribe(response => {
        if (response === undefined) {
          this.mostraErro('Não foi possível consultar locais. Verifique conexão com Internet.')
        }
        else if (response.Status == 0) {
          this.locais = response.Elementos
          this.locais.forEach(u => u.TipoLocal = Local.tipoLocal(u.Tipo))
          this.locais.forEach(u => u.TipoDisponivel = Local.tipoDisponivel(u.Disponivel))
          this.locais.forEach(u => u.TipoReservavel = Local.tipoReservavel(u.Reservavel))
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
    this.titulo = 'Novo local'
    this.local.Tipo = -1
    $('#headerLocal').removeClass('bg-warning')
  }

  inserir(): void {
    this.localService.addLocal(this.local)
      .subscribe(response => {
        if (response === undefined) {
          this.mostraErro('Não foi possível realizar o cadastro do local. Verifique conexão com Internet.')
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
        if (response === undefined) {
          this.mostraErro('Não foi possível atualizar o local. Verifique conexão com Internet.')
        }
        else if (response.Status == 0) {
          this.locais[this.selectedIndex].Nome = this.local.Nome;
          this.locais[this.selectedIndex].Reservavel = this.local.Reservavel;
          this.locais[this.selectedIndex].Disponivel = this.local.Disponivel;
          this.locais[this.selectedIndex].Tipo = this.local.Tipo;
          this.locais[this.selectedIndex].TipoLocal = Local.tipoLocal(this.local.Tipo)
          this.locais[this.selectedIndex].TipoDisponivel = Local.tipoDisponivel(this.local.Disponivel)
          this.locais[this.selectedIndex].TipoReservavel = Local.tipoReservavel(this.local.Reservavel)
          this.locais[this.selectedIndex].Comentario = this.local.Comentario
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
          if (response === undefined) {
            this.mostraErro('Não foi possível realizar a remoção do local. Verifique conexão com Internet.')
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
    this.local.TipoLocal = this.locais[index].TipoLocal
    this.local.Comentario = this.locais[index].Comentario
    this.titulo = 'Editar local'
    $('#headerLocal').addClass('bg-warning')

  }

  registrar(): void {
    if (this.local.Nome === undefined || this.local.Nome === '') {
      this.mostraErro('Digite o nome do local.')
      return
    }
    if (this.local.Tipo == -1) {
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

  carregarRestricoes(index: number): void {
    this.selectedIndex = index
    this.spinnerRestricoes = true
    let liberar = 0
    this.localService.getRestricoes(this.locais[index].Id)
      .subscribe(response => {
        if (response === undefined) {
          this.mostraErro('Não foi possível consultar restrições do local. Verifique conexão com Internet.')
        }
        else if (response.Status == 0) {
          this.restricoes = response.Elementos
        }
        else {
          this.mostraErro(response.Detalhes)
        }
        liberar = liberar + 1
        if (liberar == 2) this.spinnerRestricoes = false
      });

      this.localService.getNaoRestricoes(this.locais[index].Id)
      .subscribe(response => {
        if (response === undefined) {
          this.mostraErro('Não foi possível consultar categorias. Verifique conexão com Internet.')
        }
        else if (response.Status == 0) {
          this.naorestricoes = []
          this.naorestricoes.push({ Id: 0, Nome: '--Escolha um equipamento--', Comentario: '' })
          this.naorestricoes = response.Elementos
          this.naorestricaoId = 0
        }
        else {
          this.mostraErro(response.Detalhes)
        }
        liberar = liberar + 1
        if (liberar == 2) this.spinnerRestricoes = false
      });
    this.localRestricao = this.locais[index].Nome
    $('#modalRestricoes').modal('show')
  }

  restringir(): void {
    if (this.naorestricaoId == 0){
      this.mostraErro('Escolha um tipo de equipamento.')
      return
    }
    this.localService.addRestricao(this.locais[this.selectedIndex].Id, this.naorestricaoId)
      .subscribe(response => {
        if (response === undefined) {
          this.mostraErro('Não foi possível cadastrar restrição para o local. Verifique conexão com Internet.')
        }
        else if (response.Status == 0) {
          this.carregarRestricoes(this.selectedIndex)
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  removerRestricao(index): void {
    console.log(this.restricoes[index].Id)
    this.localService.deleteRestricao(this.locais[this.selectedIndex].Id, this.restricoes[index].Id)
      .subscribe(response => {
        if (response === undefined) {
          this.mostraErro('Não foi possível remover restrição para o local. Verifique conexão com Internet.')
        }
        else if (response.Status == 0) {
          this.carregarRestricoes(this.selectedIndex)
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  mostraErro(detalhe): void {
    this.erroDetalhe = detalhe
    $('#modalErro').modal('show')
  }

}
