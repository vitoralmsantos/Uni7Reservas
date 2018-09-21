import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../model/usuario.model';

@Component({
  selector: 'uni7res-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuarios: Usuario[];
  usuario: Usuario;
  selectedIndex : number;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.getUsuarios();
    this.limpar()
  }

  getUsuarios(): void {
    this.usuarioService.getUsuarios()
      .subscribe(response => {
        if (response.Status == 0){
          this.usuarios = response.Usuarios
        } 
        else{
          
        }
      });
  }

  getUsuario(id): void {
    this.usuarioService.getUsuario(id)
      .subscribe(response => { this.usuario = response.Usuario });
  }

  atualizar(): void {
    this.usuarioService.updateUsuario(this.usuario)
      .subscribe(response => {
        if (response.Status == 0) {
          this.limpar()
          this.usuarios[this.selectedIndex].Nome = response.Usuario.Nome;
          this.usuarios[this.selectedIndex].Email = response.Usuario.Email;
          this.usuarios[this.selectedIndex].Tipo = response.Usuario.Tipo;
        }
        else {
          alert(response.Detalhes)
        }
      });
  }

  limpar(): void {
    this.usuario = new Usuario()
  }

  carregar(index): void {
    this.selectedIndex = index
    this.usuario.Id = this.usuarios[index].Id
    this.usuario.Nome = this.usuarios[index].Nome
    this.usuario.Email = this.usuarios[index].Email
    this.usuario.Tipo = this.usuarios[index].Tipo
  }

  registrar(): void {
    if (this.usuario.Id === undefined) {

    }
    else {
      this.atualizar()
    }
  }
}