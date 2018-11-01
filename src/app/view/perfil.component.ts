import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../model/usuario.model';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'uni7res-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: Usuario
  erroDetalhe: string

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
  }

  getUsuario(id): void {
    this.usuarioService.getUsuario(id)
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
