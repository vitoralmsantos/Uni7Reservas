import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sair',
  templateUrl: './sair.component.html'
})
export class SairComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.authService.storeToken(null)
    this.authService.storeUserId(null)
    this.authService.storeUsuario(null)
    this.router.navigateByUrl('/');
  }

}
