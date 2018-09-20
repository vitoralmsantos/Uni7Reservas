import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuariosResponse } from './response/usuarios.response';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  private usuarioUrl = 'http://localhost:51859/api/usuario';

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<UsuariosResponse> {
    return this.http.get<UsuariosResponse>(this.usuarioUrl)
  }

}