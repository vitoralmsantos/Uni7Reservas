import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ReservaRegistro } from '../model/reservaregistro.model';
import { EntidadeResponse } from './response/entidade.response';
import { EntidadesResponse } from './response/entidades.response';
import { Reserva } from '../model/reserva.model';

@Injectable({ providedIn: 'root' })
export class ReservaService {

  readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  };

  private reservaUrl = 'http://localhost:51859/api/reserva';

  constructor(private http: HttpClient) { }

  getReservas(): Observable<EntidadesResponse<Reserva>> {
    return this.http.get<EntidadesResponse<Reserva>>(this.reservaUrl)
      .pipe(catchError(this.handleError<EntidadesResponse<Reserva>>('getReservas')));
  }

  getPorUsuario(idUsuario: number): Observable<EntidadesResponse<Reserva>> {
    let url = `${this.reservaUrl}/usuario/${idUsuario}`;
    return this.http.get<EntidadesResponse<Reserva>>(url)
      .pipe(catchError(this.handleError<EntidadesResponse<Reserva>>('getPorUsuario')));
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