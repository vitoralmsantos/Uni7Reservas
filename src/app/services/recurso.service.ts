import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { RecursosResponse } from './response/recursos.response';
import { RecursoResponse } from './response/recurso.response';
import { Recurso } from '../model/recurso.model';

@Injectable({ providedIn: 'root' })
export class RecursoService { 

    readonly httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      };

    private recursoUrl = 'http://localhost:51859/api/recurso';

    constructor(private http: HttpClient){}

    getRecursos(): Observable<RecursosResponse> {
        return this.http.get<RecursosResponse>(this.recursoUrl)
          .pipe(catchError(this.handleError<RecursosResponse>('getRecursos')));
      }

    getRecurso(id: number): Observable<RecursoResponse> {
        const url = `${this.recursoUrl}/consulta/${id}`;
        return this.http.get<RecursoResponse>(url)
          .pipe(catchError(this.handleError<RecursoResponse>(`getRecurso id=${id}`)));
      }

    updateRecurso(recurso: Recurso): Observable<any> {
        let u = new URLSearchParams();
        u.set('Id', recurso.Id.toString());
        u.set('Nome', recurso.Nome.toString());
        u.set('Detalhes', recurso.Detalhes.toString());
        u.set('Vencimento', recurso.Vencimento.toString());
        u.set('Tipo', recurso.Tipo.toString());
    
        let url = `${this.recursoUrl}/${recurso.Id}`;
        return this.http.put<RecursoResponse>(url, u.toString(), this.httpOptions)
          .pipe(catchError(this.handleError<RecursoResponse>('updateRecurso')));
      }  
    addRecurso(recurso: Recurso): Observable<any> {
        let u = new URLSearchParams();
        u.set('Nome', recurso.Nome.toString());
        u.set('Detalhes', recurso.Detalhes.toString());
        u.set('Vencimento', recurso.Vencimento.toString());
        u.set('Tipo', recurso.Tipo.toString());

        return this.http.post<RecursoResponse>(this.recursoUrl, u.toString(), this.httpOptions)
          .pipe(catchError(this.handleError<RecursoResponse>('addRecurso')));
      }

    deleteRecurso(id: Number): Observable<any> {
        let url = `${this.recursoUrl}/${id}`;
        return this.http.delete<RecursoResponse>(url, this.httpOptions)
          .pipe(catchError(this.handleError<RecursoResponse>('deleteRecurso')));
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
    