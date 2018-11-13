import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Usuario } from '../model/usuario.model';
import { EntidadesResponse } from './response/entidades.response';
import { EntidadeResponse } from './response/entidade.response';
import { TokenResponse } from './response/token.response';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    params: new HttpParams()
      .set('api-key', this.authService.retrieveToken())
      .set('userid', this.authService.retrieveUserId())
  };

  private usuarioUrl = 'http://localhost:51859/api/usuario';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUsuarios(): Observable<EntidadesResponse<Usuario>> {
    return this.http.get<EntidadesResponse<Usuario>>(this.usuarioUrl, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadesResponse<Usuario>>('getUsuarios')));
  }

  getUsuario(id: number): Observable<EntidadeResponse<Usuario>> {
    const url = `${this.usuarioUrl}/consulta/${id}`;
    return this.http.get<EntidadeResponse<Usuario>>(url, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Usuario>>(`getUsuario id=${id}`)));
  }

  autenticar(email: string, senha: string): Observable<any> {
    const url = `${this.usuarioUrl}/login`;
    let u = new URLSearchParams();
    u.set('Email', email);
    u.set('Senha', senha);

    return this.http.post<EntidadeResponse<TokenResponse>>(url, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<TokenResponse>>('autenticarUsuario')));
  }

  updateMeuDados(usuario: Usuario): Observable<any> {
    let u = new URLSearchParams();
    u.set('Id', usuario.Id.toString());
    u.set('Nome', usuario.Nome.toString());
    u.set('Email', usuario.Email.toString());

    let url = `${this.usuarioUrl}/atualizardados/${usuario.Id}`;
    return this.http.put<EntidadeResponse<Usuario>>(url, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Usuario>>('updateMeuDados')));
  }

  updateSenha(id: number, senha: string): Observable<any> {
    let u = new URLSearchParams();
    u.set('Id', id.toString());
    u.set('Senha', senha.toString());

    let url = `${this.usuarioUrl}/alterarsenha/${id}`;
    return this.http.put<EntidadeResponse<Usuario>>(url, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Usuario>>('updateSenha')));
  }

  updateUsuario(usuario: Usuario): Observable<any> {
    let u = new URLSearchParams();
    u.set('Id', usuario.Id.toString());
    u.set('Nome', usuario.Nome.toString());
    u.set('Email', usuario.Email.toString());
    u.set('Tipo', usuario.Tipo.toString());

    let url = `${this.usuarioUrl}/${usuario.Id}`;
    return this.http.put<EntidadeResponse<Usuario>>(url, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Usuario>>('updateUsuario')));
  }

  addUsuario(usuario: Usuario): Observable<any> {
    let u = new URLSearchParams();
    u.set('Nome', usuario.Nome.toString());
    u.set('Email', usuario.Email.toString());
    u.set('Tipo', usuario.Tipo.toString());

    return this.http.post<EntidadeResponse<Usuario>>(this.usuarioUrl, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Usuario>>('addUsuario')));
  }

  deleteUsuario(id: Number): Observable<any> {
    let url = `${this.usuarioUrl}/${id}`;
    return this.http.delete<EntidadeResponse<Usuario>>(url, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Usuario>>('deleteUsuario')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}