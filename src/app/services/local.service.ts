import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Local } from '../model/local.model';
import { LocaisResponse } from './response/locais.response';
import { LocalResponse } from './response/local.response';
import { EntidadeResponse } from './response/entidade.response';
import { EntidadesResponse } from './response/entidades.response';

@Injectable({ providedIn: 'root' })
export class LocalService {

  readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  };

  private localUrl = 'http://localhost:51859/api/local';

  constructor(private http: HttpClient) { }

  getLocais(): Observable<EntidadesResponse<Local>> {
    return this.http.get<EntidadesResponse<Local>>(this.localUrl)
      .pipe(catchError(this.handleError<EntidadesResponse<Local>>('getLocais')));
  }

  //Consulta locais disponíveis para reservas
  getDisponibilidade(data: string, horario: string, turno: string): Observable<EntidadesResponse<Local>> {
    let url = `${this.localUrl}/disponibilidade/?data=${data}&horario=${horario}&turno=${turno}`;
    return this.http.get<EntidadesResponse<Local>>(url)
      .pipe(catchError(this.handleError<EntidadesResponse<Local>>('getDisponibilidade')));
  }

  getLocal(id: number): Observable<EntidadeResponse<Local>> {
    const url = `${this.localUrl}/consulta/${id}`;
    return this.http.get<EntidadeResponse<Local>>(url)
      .pipe(catchError(this.handleError<EntidadeResponse<Local>>(`getLocal id=${id}`)));
  }

  updateLocal(local: Local): Observable<any> {
    let u = new URLSearchParams();
    u.set('Id', local.Id.toString());
    u.set('Nome', local.Nome.toString());
    u.set('Reservavel', local.Reservavel.toString());
    u.set('Disponivel', local.Disponivel.toString());
    u.set('Tipo', local.Tipo.toString());

    let url = `${this.localUrl}/${local.Id}`;
    return this.http.put<EntidadeResponse<Local>>(url, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Local>>('updateLocal')));
  }
  addLocal(local: Local): Observable<any> {
    let u = new URLSearchParams();
    u.set('Nome', local.Nome.toString());
    u.set('Reservavel', local.Reservavel.toString());
    u.set('Disponivel', local.Disponivel.toString());
    u.set('Tipo', local.Tipo.toString());

    return this.http.post<EntidadeResponse<Local>>(this.localUrl, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Local>>('addLocal')));
  }

  deleteLocal(id: Number): Observable<any> {
    let url = `${this.localUrl}/${id}`;
    return this.http.delete<EntidadeResponse<Local>>(url, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Local>>('deleteLocal')));
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