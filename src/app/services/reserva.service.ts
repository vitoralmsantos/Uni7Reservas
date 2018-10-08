import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { ReservasResponse } from './response/reservas.response';
import { ReservaResponse } from './response/reserva.response';
import { Reserva } from '../model/reserva.model';

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

  addReserva(reserva: Reserva): Observable<any> {
    let u = new URLSearchParams();
    

    return this.http.post<ReservaResponse>(this.equipamentoUrl, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<ReservaResponse>('addReserva')));
  }

  deleteReserva(id: Number): Observable<any> {
    let url = `${this.equipamentoUrl}/${id}`;
    return this.http.delete<ReservaResponse>(url, this.httpOptions)
      .pipe(catchError(this.handleError<ReservaResponse>('deleteReserva')));
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