import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
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

  constructor(private route: ActivatedRoute, private router: Router,
    private usuarioService: UsuarioService, private authService: AuthService) {
  }

  ngOnInit() {
  }

  login() {
    this.usuarioService.autenticar(this.email, this.senha)
      .subscribe(response => {
        if (response === undefined) {
          this.mostrarErro('Não foi possível realizar a autenticação. Verifique sua conexão com a Internet.')
        }
        else if (response.Status == 0) {
          this.authService.storeToken(response.Token)
          this.authService.storeUserId(response.UserID)
          this.authService.storeUsuario(response.Usuario)
          this.router.navigate(['/principal'], { relativeTo: this.route });
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
