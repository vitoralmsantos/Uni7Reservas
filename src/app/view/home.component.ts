import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../model/usuario.model';
import { AuthService } from '../services/auth.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'uni7res-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  email: string
  senha: string
  usuario: Usuario

  erroDetalhe: string;

  constructor(private route: ActivatedRoute, private router: Router,
    private usuarioService: UsuarioService, private authService: AuthService) {
  }

  ngOnInit() {
    this.usuario = new Usuario()
  }

  login() {
    this.usuarioService.autenticar(this.email, this.senha)
      .subscribe(response => {
        if (response === undefined) {
          this.mostrarErro('Não foi possível realizar a autenticação. Verifique sua conexão com a Internet.')
        }
        else if (response.Status == 0) {
          this.usuario = response.Usuario
          this.authService.storeUserId(this.usuario.Id)
          
        }
        else {
          this.mostrarErro(response.Detalhes)
        }
      });

      this.router.navigate(['/principal'], { relativeTo: this.route });
  }

  mostrarErro(detalhe): void {
    this.erroDetalhe = detalhe
    $('#modalErro').modal('show')
  }
}
