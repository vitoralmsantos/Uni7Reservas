import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Usuario } from '../model/usuario.model';
import { UsuariosResponse } from './response/usuarios.response';
import { UsuarioResponse } from './response/usuario.response';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  };

  private usuarioUrl = 'http://localhost:51859/api/usuario';

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<UsuariosResponse> {
    return this.http.get<UsuariosResponse>(this.usuarioUrl)
      .pipe(catchError(this.handleError<UsuariosResponse>('getUsuarios')));
  }

  getUsuario(id: number): Observable<UsuarioResponse> {
    const url = `${this.usuarioUrl}/consulta/${id}`;
    return this.http.get<UsuarioResponse>(url)
      .pipe(catchError(this.handleError<UsuarioResponse>(`getUsuario id=${id}`)));
  }

  updateUsuario(usuario: Usuario): Observable<any> {
    let u = new URLSearchParams();
    u.set('Id', usuario.Id.toString());
    u.set('Nome', usuario.Nome.toString());
    u.set('Email', usuario.Email.toString());
    u.set('Tipo', usuario.Tipo.toString());

    let url = `${this.usuarioUrl}/${usuario.Id}`;
    return this.http.put<UsuarioResponse>(url, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<UsuarioResponse>('updateUsuario')));
  }

  addUsuario(usuario: Usuario): Observable<any> {
    let u = new URLSearchParams();
    u.set('Nome', usuario.Nome.toString());
    u.set('Email', usuario.Email.toString());
    u.set('Tipo', usuario.Tipo.toString());

    return this.http.post<UsuarioResponse>(this.usuarioUrl, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<UsuarioResponse>('addUsuario')));
  }

  deleteUsuario(id: Number): Observable<any> {
    let url = `${this.usuarioUrl}/${id}`;
    return this.http.delete<UsuarioResponse>(url, this.httpOptions)
      .pipe(catchError(this.handleError<UsuarioResponse>('deleteUsuario')));
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