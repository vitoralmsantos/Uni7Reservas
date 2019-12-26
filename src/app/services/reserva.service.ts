import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ReservaRegistro } from '../model/reservaregistro.model';
import { EntidadeResponse } from './response/entidade.response';
import { EntidadesResponse } from './response/entidades.response';
import { Reserva } from '../model/reserva.model';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class ReservaService {

  readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    params: new HttpParams()
      .set(this.authService.tokenKey, this.authService.retrieveToken())
      .set(this.authService.userId, this.authService.retrieveUserId())
  };

  private reservaUrl = this.authService.BASEPATH + 'reserva';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getReservas(): Observable<EntidadesResponse<Reserva>> {
    return this.http.get<EntidadesResponse<Reserva>>(this.reservaUrl, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadesResponse<Reserva>>('getReservas')));
  }

  getPorUsuario(idUsuario: number): Observable<EntidadesResponse<Reserva>> {
    let url = `${this.reservaUrl}/usuario/${idUsuario}`
    return this.http.get<EntidadesResponse<Reserva>>(url, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadesResponse<Reserva>>('getPorUsuario')));
  }

  getPorFiltro(dataDe: string, dataAte: string, tipo: number, idLocal: number,
    idCategoria: number, obs: string): Observable<EntidadesResponse<Reserva>> {
    let url = `${this.reservaUrl}/filtro/?dataDe=${dataDe}&dataAte=${dataAte}&tipo=${tipo}&idLocal=${idLocal}&idCategoria=${idCategoria}&obs=${obs}`;
    return this.http.get<EntidadesResponse<Reserva>>(url, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadesResponse<Reserva>>('getPorFiltro')));
  }

  addReserva(reserva: ReservaRegistro): Observable<any> {
    let u = new URLSearchParams();
    u.set('Data', reserva.Data.toString());
    u.set('Horario', reserva.Horario.toString());
    u.set('Turno', reserva.Turno.toString());
    u.set('Obs', reserva.Obs.toString());
    u.set('IdLocal', reserva.IdLocal.toString());
    u.set('IdUsuario', reserva.IdUsuario.toString());
    u.set('IdCategoria', reserva.IdCategoria.toString());

    return this.http.post<EntidadeResponse<Reserva>>(this.reservaUrl, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Reserva>>('addReserva')));
  }

  atualizarObs(id: number, obs: string): Observable<any> {
    let url = `${this.reservaUrl}/obs`;
    let u = new URLSearchParams();
    u.set('Id', id.toString());
    u.set('Obs', obs.toString());

    return this.http.post<EntidadeResponse<Reserva>>(url, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Reserva>>('atualizarObs')));
  }

  atualizarAvaliacao(id: number, satisfacao: number, comentarioUsuario: string): Observable<any> {
    let url = `${this.reservaUrl}/avaliacao`;
    let u = new URLSearchParams();
    u.set('Id', id.toString());
    u.set('Satisfacao', satisfacao.toString());
    u.set('ComentarioUsuario', comentarioUsuario.toString());

    return this.http.post<EntidadeResponse<Reserva>>(url, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Reserva>>('atualizarAvaliacao')));
  }

  deleteReserva(id: Number): Observable<any> {
    let url = `${this.reservaUrl}/${id}`;
    return this.http.delete<EntidadeResponse<Reserva>>(url, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Reserva>>('deleteReserva')));
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