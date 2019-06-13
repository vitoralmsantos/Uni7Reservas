import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario.model';

@Component({
  selector: 'uni7res-relatorio-avaliacao',
  templateUrl: './relatorio-avaliacao.component.html',
  styleUrls: ['./relatorio-avaliacao.component.css']
})
export class RelatorioAvaliacaoComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.retrieveUserId() == '0' 
    || !Usuario.permissao(this.authService.retrieveUsuario().Tipo, '/principal/relatorios/avaliacao')) {
      this.router.navigateByUrl('/');
    }
  }
}
