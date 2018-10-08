import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BaseResponse } from './response/base.response';
import { ReservasResponse } from './response/reservas.response';
import { ReservaResponse } from './response/reserva.response';
import { ReservaRegistro } from '../model/reservaregistro.model';

@Injectable({ providedIn: 'root' })
export class ReservaService {

  readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  };

  private equipamentoUrl = 'http://localhost:51859/api/reserva';

  constructor(private http: HttpClient) { }

  getReservas(): Observable<ReservasResponse> {
    return this.http.get<ReservasResponse>(this.equipamentoUrl)
      .pipe(catchError(this.handleError<ReservasResponse>('getReservas')));
  }

  addReserva(reserva: ReservaRegistro): Observable<any> {
    let u = new URLSearchParams();
    u.set('Data', reserva.Data.toString());
    u.set('Horario', reserva.Horario.toString());
    u.set('Turno', reserva.Turno.toString());
    u.set('Obs', reserva.Obs.toString());
    u.set('IdLocal', reserva.IdLocal.toString());
    u.set('IdUsuario', reserva.IdUsuario.toString());
    u.set('IdEquipamento1', reserva.IdEquipamento1.toString());
    u.set('IdEquipamento2', reserva.IdEquipamento2.toString());

    return this.http.post<ReservaResponse>(this.equipamentoUrl, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<ReservaResponse>('addReserva')));
  }

  deleteReserva(id: Number): Observable<any> {
    let url = `${this.equipamentoUrl}/${id}`;
    return this.http.delete<BaseResponse>(url, this.httpOptions)
      .pipe(catchError(this.handleError<BaseResponse>('deleteReserva')));
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