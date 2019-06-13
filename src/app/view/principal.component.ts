import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from '../model/usuario.model';


@Component({
  selector: 'uni7res-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  usuario : Usuario = { Id : 0, Nome : '', Email : '', Tipo : -1, TipoExtenso : ''}
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.retrieveUserId() == '0') {
      this.router.navigateByUrl('/');
    } else {
      this.usuario = this.authService.retrieveUsuario()
    }
  }

}
