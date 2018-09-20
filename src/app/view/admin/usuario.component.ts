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

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.getUsuarios();
  }

  getUsuarios(): void {
    this.usuarioService.getUsuarios()
      .subscribe(response => {alert(response); this.usuarios = response.Usuarios});
  }
}
