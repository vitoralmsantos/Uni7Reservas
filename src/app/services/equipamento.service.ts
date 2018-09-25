import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { EquipamentosResponse } from './response/equipamentos.response';
import { EquipamentoResponse } from './response/equipamento.response';
import { Equipamento } from '../model/equipamento.model';

@Injectable({ providedIn: 'root' })
export class LocalService { 

    readonly httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      };

    private equipamentoUrl = 'http://equipamentohost:51859/api/equipamento';

    constructor(private http: HttpClient){}

    getEquipamentos(): Observable<EquipamentosResponse> {
        return this.http.get<EquipamentosResponse>(this.equipamentoUrl)
          .pipe(catchError(this.handleError<EquipamentosResponse>('getLocais')));
      }
    
    getEquipamento(id: number): Observable<EquipamentoResponse> {
        const url = `${this.equipamentoUrl}/consulta/${id}`;
        return this.http.get<EquipamentoResponse>(url)
          .pipe(catchError(this.handleError<EquipamentoResponse>(`getLocal id=${id}`)));
      }

    updateEquipamento(equipamento: Equipamento): Observable<any> {
        let u = new URLSearchParams();
        u.set('Id', equipamento.Id.toString());
        u.set('Modelo', equipamento.Modelo.toString());
        u.set('Disponivel', equipamento.Disponivel.toString());
    
        let url = `${this.equipamentoUrl}/${equipamento.Id}`;
        return this.http.put<EquipamentoResponse>(url, u.toString(), this.httpOptions)
          .pipe(catchError(this.handleError<EquipamentoResponse>('updateEquipamento')));
      }  
      addEquipamento(equipamento: Equipamento): Observable<any> {
        let u = new URLSearchParams();
        u.set('Modelo', equipamento.Modelo.toString());
        u.set('Disponivel', equipamento.Disponivel.toString());
    
        return this.http.post<EquipamentoResponse>(this.equipamentoUrl, u.toString(), this.httpOptions)
          .pipe(catchError(this.handleError<EquipamentoResponse>('addEquipamento')));
      }
    
      deleteEquipamento(id: Number): Observable<any> {
        let url = `${this.equipamentoUrl}/${id}`;
        return this.http.delete<EquipamentoResponse>(url, this.httpOptions)
          .pipe(catchError(this.handleError<EquipamentoResponse>('deleteEquipamento')));
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