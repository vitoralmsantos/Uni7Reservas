import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../model/usuario.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'uni7res-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: Usuario
  senhaAtual: string
  novaSenha: string
  confNovaSenha: string
  msgTitulo: string
  msgDetalhe: string
  erroDetalhe: string

  constructor(private usuarioService: UsuarioService, private authService: AuthService, private router: Router) { }

  ngOnInit() {

    if (this.authService.retrieveUserId() == '0')  {
      this.router.navigateByUrl('/');
    }

    this.usuario = this.authService.retrieveUsuario()
    this.senhaAtual = ''
    this.novaSenha = ''
    this.confNovaSenha = ''
    
    this.getUsuario()
  }

  getUsuario(): void {
    this.usuarioService.getUsuario(this.usuario.Id)
      .subscribe(response => { 
        this.usuario = response.Elemento 
        this.usuario.TipoExtenso = Usuario.tipoExtenso(this.usuario.Tipo)
      });
  }

  atualizarDados(): void {
    this.usuarioService.updateMeuDados(this.usuario)
      .subscribe(response => {
        if (response === undefined){
          this.mostraErro('Não foi possível realizar a atualização do usuário.')
        }
        else if (response.Status == 0) {
          this.mostraMsg('Alteração dos dados', 'Dados atualizados com sucesso.')
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  atualizarSenha(): void {
    if (this.senhaAtual.length == 0) {
      this.mostraErro('Preencha a senha atual.')
      return
    }
    else if (this.novaSenha.length == 0) {
      this.mostraErro('Preencha a nova senha.')
      return
    }
    else if (this.confNovaSenha.length == 0) {
      this.mostraErro('Preencha a confirmação da nova senha.')
      return
    }
    else if (this.novaSenha != this.confNovaSenha){
      this.mostraErro('Nova senha e sua confirmação são diferentes.')
      return
    }

    this.usuarioService.updateSenha(this.usuario.Id, this.novaSenha)
      .subscribe(response => {
        if (response === undefined){
          this.mostraErro('Não foi possível realizar a atualização da senha.')
        }
        else if (response.Status == 0) {
          this.mostraMsg('Alteração da senha', 'Senha atualizada com sucesso.')
        }
        else {
          this.mostraErro(response.Detalhes)
        }
      });
  }

  mostraMsg(msgTitulo, msgDetalhe): void {
    this.msgTitulo = msgTitulo
    this.msgDetalhe = msgDetalhe
    $('#modalMsg').modal('show')
  }

  mostraErro(detalhe): void {
    this.erroDetalhe = detalhe
    $('#modalErro').modal('show')
  }
}
