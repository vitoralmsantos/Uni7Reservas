import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../model/usuario.model';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'uni7res-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuarios: Usuario[]
  usuario: Usuario
  erroDetalhe: string
  selectedIndex: number
  titulo: string

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.getUsuarios()
    this.limpar()
  }

  tipoUsuario(usuario: Usuario): string{
    return Usuario.tipoExtenso(usuario.Tipo)
  }

  getUsuarios(): void {
    this.usuarioService.getUsuarios()
      .subscribe(response => {
        if (response.Status == 0) {
          this.usuarios = response.Elementos
          this.usuarios.forEach(u => u.TipoExtenso = Usuario.tipoExtenso(u.Tipo))
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  getUsuario(id): void {
    this.usuarioService.getUsuario(id)
      .subscribe(response => { 
        this.usuario = response.Elemento 
        this.usuario.TipoExtenso = Usuario.tipoExtenso(this.usuario.Tipo)
      });
  }

  inserir(): void {
    this.usuarioService.addUsuario(this.usuario)
      .subscribe(response => {
        if (response === undefined){
          this.mostraErro('Não foi possível realizar o cadastro do usuário.')
        }
        else if (response.Status == 0) {
          this.limpar()
          this.getUsuarios();
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  atualizar(): void {
    this.usuarioService.updateUsuario(this.usuario)
      .subscribe(response => {
        if (response === undefined){
          this.mostraErro('Não foi possível realizar a atualização do usuário.')
        }
        else if (response.Status == 0) {
          this.usuarios[this.selectedIndex].Nome = this.usuario.Nome;
          this.usuarios[this.selectedIndex].Email = this.usuario.Email;
          this.usuarios[this.selectedIndex].Tipo = this.usuario.Tipo;
          this.usuarios[this.selectedIndex].TipoExtenso = Usuario.tipoExtenso(this.usuario.Tipo)
          this.limpar()
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  remover(index): void {
    if (confirm('Confirma remoção de ' + this.usuarios[index].Nome)) {
      let id = this.usuarios[index].Id
      this.usuarioService.deleteUsuario(id)
      .subscribe(response => {
        if (response === undefined){
          this.mostraErro('Não foi possível realizar a remoção do usuário.')
        }
        else if (response.Status == 0) {
          this.limpar()
          this.getUsuarios();
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
    }
  }

  limpar(): void {
    this.usuario = new Usuario()
    this.usuario.Tipo = -1
    this.titulo = 'Novo usuário'
    $('#headerUsuario').removeClass('bg-warning')
  }

  carregar(index): void {
    this.selectedIndex = index
    this.usuario.Id = this.usuarios[index].Id
    this.usuario.Nome = this.usuarios[index].Nome
    this.usuario.Email = this.usuarios[index].Email
    this.usuario.Tipo = this.usuarios[index].Tipo
    this.usuario.TipoExtenso = this.usuarios[index].TipoExtenso
    this.titulo = 'Editar usuário'
    $('#headerUsuario').addClass('bg-warning')
  }

  registrar(): void {
    if (this.usuario.Nome === undefined || this.usuario.Nome === ''){
      this.mostraErro('Digite o nome do usuário.')
      return
    }
    if (this.usuario.Email === undefined || this.usuario.Email === ''){
      this.mostraErro('Digite o e-mail do usuário.')
      return
    }
    if (this.usuario.Tipo == -1){
      this.mostraErro('Escolha um tipo de usuário.')
      return
    }
    
    if (this.usuario.Id === undefined) {
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