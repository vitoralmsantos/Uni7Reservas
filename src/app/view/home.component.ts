import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { TIPOUSUARIO } from '../model/usuario.model';
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
  erroDetalhe: string;
  spinnerAutenticando: boolean

  constructor(private route: ActivatedRoute, private router: Router,
    private usuarioService: UsuarioService, private authService: AuthService) {
  }

  ngOnInit() {
    this.spinnerAutenticando = false
  }

  login() {
    this.spinnerAutenticando = true
    this.usuarioService.autenticar(this.email, this.senha)
      .subscribe(response => {
        this.spinnerAutenticando = false
        if (response === undefined) {
          this.mostrarErro('Não foi possível realizar a autenticação. Verifique sua conexão com a Internet.')
        }
        else if (response.Status == 0) {
          this.authService.storeToken(response.Token)
          this.authService.storeUserId(response.UserID)
          this.authService.storeUsuario(response.Usuario)
          if (response.Usuario.Tipo as TIPOUSUARIO == TIPOUSUARIO.ADMIN) {
            this.router.navigate(['/principal/reservaadmin'], { relativeTo: this.route });
          }
          else {
            this.router.navigate(['/principal/reserva'], { relativeTo: this.route });
          }
        }
        else {
          this.mostrarErro(response.Detalhes)
        }
    });
  }

  mostrarErro(detalhe): void {
    this.erroDetalhe = detalhe
    $('#modalErro').modal('show')
  }
}
