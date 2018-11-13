import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Recurso } from '../model/recurso.model';
import { EntidadeResponse } from './response/entidade.response';
import { EntidadesResponse } from './response/entidades.response';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RecursoService {

  readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    params: new HttpParams()
      .set(this.authService.tokenKey, this.authService.retrieveToken())
      .set(this.authService.userId, this.authService.retrieveUserId())
  };

  private recursoUrl = 'http://localhost:51859/api/recurso';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getRecursos(): Observable<EntidadesResponse<Recurso>> {
    return this.http.get<EntidadesResponse<Recurso>>(this.recursoUrl, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadesResponse<Recurso>>('getRecursos')));
  }

  getRecurso(id: number): Observable<EntidadeResponse<Recurso>> {
    const url = `${this.recursoUrl}/consulta/${id}`;
    return this.http.get<EntidadeResponse<Recurso>>(url, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Recurso>>(`getRecurso id=${id}`)));
  }

  updateRecurso(recurso: Recurso): Observable<any> {
    let u = new URLSearchParams();
    u.set('Id', recurso.Id.toString());
    u.set('Nome', recurso.Nome.toString());
    u.set('Detalhes', recurso.Detalhes.toString());
    u.set('Vencimento', recurso.Vencimento.toString());
    u.set('Tipo', recurso.Tipo.toString());

    let url = `${this.recursoUrl}/${recurso.Id}`;
    return this.http.put<EntidadeResponse<Recurso>>(url, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Recurso>>('updateRecurso')));
  }
  addRecurso(recurso: Recurso): Observable<any> {
    let u = new URLSearchParams();
    u.set('Nome', recurso.Nome.toString());
    u.set('Detalhes', recurso.Detalhes.toString());
    u.set('Vencimento', recurso.Vencimento.toString());
    u.set('Tipo', recurso.Tipo.toString());

    return this.http.post<EntidadeResponse<Recurso>>(this.recursoUrl, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Recurso>>('addRecurso')));
  }

  deleteRecurso(id: Number): Observable<any> {
    let url = `${this.recursoUrl}/${id}`;
    return this.http.delete<EntidadeResponse<Recurso>>(url, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Recurso>>('deleteRecurso')));
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
