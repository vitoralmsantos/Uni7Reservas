import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Local } from '../model/local.model';
import { EntidadeResponse } from './response/entidade.response';
import { EntidadesResponse } from './response/entidades.response';
import { Categoria } from '../model/categoria.model';
import { BaseResponse } from './response/base.response';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class LocalService {

  readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    params: new HttpParams()
      .set(this.authService.tokenKey, this.authService.retrieveToken())
      .set(this.authService.userId, this.authService.retrieveUserId())
  };

  private localUrl = this.authService.BASEPATH + 'local';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getLocais(): Observable<EntidadesResponse<Local>> {
    return this.http.get<EntidadesResponse<Local>>(this.localUrl, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadesResponse<Local>>('getLocais')));
  }

  //Consulta locais disponíveis para reservas
  getDisponibilidade(data: string, horario: string, turno: string): Observable<EntidadesResponse<Local>> {
    let url = `${this.localUrl}/disponibilidade/?data=${data}&horario=${horario}&turno=${turno}`;
    return this.http.get<EntidadesResponse<Local>>(url, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadesResponse<Local>>('getDisponibilidade')));
  }

  getLocal(id: number): Observable<EntidadeResponse<Local>> {
    const url = `${this.localUrl}/consulta/${id}`;
    return this.http.get<EntidadeResponse<Local>>(url, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Local>>(`getLocal id=${id}`)));
  }

  getRestricoes(id: number): Observable<EntidadesResponse<Categoria>> {
    const url = `${this.localUrl}/restricoes/${id}`;
    return this.http.get<EntidadesResponse<Categoria>>(url, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadesResponse<Categoria>>(`getRestricoes id=${id}`)));
  }

  getNaoRestricoes(id: number): Observable<EntidadesResponse<Categoria>> {
    const url = `${this.localUrl}/naorestricoes/${id}`;
    return this.http.get<EntidadesResponse<Categoria>>(url, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadesResponse<Categoria>>(`getNaoRestricoes id=${id}`)));
  }

  updateLocal(local: Local): Observable<any> {
    let u = new URLSearchParams();
    u.set('Id', local.Id.toString());
    u.set('Nome', local.Nome.toString());
    u.set('Reservavel', local.Reservavel.toString());
    u.set('Disponivel', local.Disponivel.toString());
    u.set('Tipo', local.Tipo.toString());
    if (local.Comentario === undefined || local.Comentario == null) {
      local.Comentario = ''
    }
    u.set('ComentarioReserva', local.Comentario.toString());

    let url = `${this.localUrl}/atualizar`;
    return this.http.post<EntidadeResponse<Local>>(url, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Local>>('updateLocal')));
  }

  addLocal(local: Local): Observable<any> {
    let u = new URLSearchParams();
    u.set('Nome', local.Nome.toString());
    u.set('Reservavel', local.Reservavel.toString());
    u.set('Disponivel', local.Disponivel.toString());
    u.set('Tipo', local.Tipo.toString());
    if (local.Comentario === undefined || local.Comentario == null) {
      local.Comentario = ''
    }
    u.set('ComentarioReserva', local.Comentario.toString());

    return this.http.post<EntidadeResponse<Local>>(this.localUrl, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Local>>('addLocal')));
  }

  addRestricao(idLocal: number, idCategoria: number): Observable<any> {
    let u = new URLSearchParams();
    u.set('IdLocal', idLocal.toString());
    u.set('IdCategoria', idCategoria.toString());

    let url = `${this.localUrl}/cadastrarrestricao`;
    return this.http.post<BaseResponse>(url, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<BaseResponse>('addRestricao')));
  }

  deleteLocal(id: Number): Observable<any> {
    let url = `${this.localUrl}/remover`;
    let u = new URLSearchParams();
    u.set('Id', id.toString());
    return this.http.post<EntidadeResponse<Local>>(url, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Local>>('deleteLocal')));
  }

  deleteRestricao(idLocal: number, idCategoria: number): Observable<any> {
    let u = new URLSearchParams();
    u.set('IdLocal', idLocal.toString());
    u.set('IdCategoria', idCategoria.toString());

    let url = `${this.localUrl}/removerrestricao`;
    return this.http.post<BaseResponse>(url, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<BaseResponse>('deleteRestricao')));
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