import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { EntidadesResponse } from './response/entidades.response';
import { Equipamento } from '../model/equipamento.model';
import { EntidadeResponse } from './response/entidade.response';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class EquipamentoService {

  readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    params: new HttpParams()
      .set(this.authService.tokenKey, this.authService.retrieveToken())
      .set(this.authService.userId, this.authService.retrieveUserId())
  };

  private equipamentoUrl = this.authService.BASEPATH + 'equipamento';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getEquipamentos(): Observable<EntidadesResponse<Equipamento>> {
    return this.http.get<EntidadesResponse<Equipamento>>(this.equipamentoUrl, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadesResponse<Equipamento>>('getEquipamentos')));
  }

  getEquipamento(id: number): Observable<EntidadeResponse<Equipamento>> {
    const url = `${this.equipamentoUrl}/consulta/${id}`;
    return this.http.get<EntidadeResponse<Equipamento>>(url, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Equipamento>>(`getEquipamento id=${id}`)));
  }

  updateEquipamento(equipamento: Equipamento): Observable<any> {
    let u = new URLSearchParams();
    u.set('Id', equipamento.Id.toString());
    u.set('Modelo', equipamento.Modelo.toString());
    u.set('Disponivel', equipamento.Disponivel.toString());
    u.set('IdCategoria', equipamento.IdCategoria.toString());
    u.set('Serie', equipamento.Serie.toString());

    let url = `${this.equipamentoUrl}/${equipamento.Id}`;
    return this.http.put<EntidadeResponse<Equipamento>>(url, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Equipamento>>('updateEquipamento')));
  }
  addEquipamento(equipamento: Equipamento): Observable<any> {
    let u = new URLSearchParams();
    u.set('Modelo', equipamento.Modelo.toString());
    u.set('Disponivel', equipamento.Disponivel.toString());
    u.set('IdCategoria', equipamento.IdCategoria.toString());
    u.set('Serie', equipamento.Serie.toString());

    return this.http.post<EntidadeResponse<Equipamento>>(this.equipamentoUrl, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Equipamento>>('addEquipamento')));
  }

  deleteEquipamento(id: Number): Observable<any> {
    let url = `${this.equipamentoUrl}/${id}`;
    return this.http.delete<EntidadeResponse<Equipamento>>(url, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Equipamento>>('deleteEquipamento')));
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