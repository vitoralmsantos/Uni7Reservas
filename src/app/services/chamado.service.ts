import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Chamado } from '../model/chamado.model';
import { EntidadeResponse } from './response/entidade.response';
import { EntidadesResponse } from './response/entidades.response';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class ChamadoService {

  readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    params: new HttpParams()
      .set(this.authService.tokenKey, this.authService.retrieveToken())
      .set(this.authService.userId, this.authService.retrieveUserId())
  };

  private chamadoUrl = this.authService.BASEPATH + 'chamado';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getChamados(): Observable<EntidadesResponse<Chamado>> {
    return this.http.get<EntidadesResponse<Chamado>>(this.chamadoUrl, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadesResponse<Chamado>>('getChamados')));
  }

  getChamado(id: number): Observable<EntidadeResponse<Chamado>> {
    const url = `${this.chamadoUrl}/consulta/${id}`;
    return this.http.get<EntidadeResponse<Chamado>>(url, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Chamado>>(`getChamado id=${id}`)));
  }

  updateChamado(chamado: Chamado): Observable<any> {
    let u = new URLSearchParams();
    u.set('Id', chamado.Id.toString());
    u.set('Descricao', chamado.Descricao.toString());
    u.set('Status', chamado.Status.toString());
    u.set('Observacoes', chamado.Observacoes.toString());
    u.set('DataLimite', chamado.DataLimite.toString());
    u.set('DataPrevista', chamado.DataPrevista.toString());
    u.set('Telefone', chamado.Telefone.toString());

    let url = `${this.chamadoUrl}/${chamado.Id}`;
    return this.http.put<EntidadeResponse<Chamado>>(url, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Chamado>>('updateChamado')));
  }
  addChamado(chamado: Chamado): Observable<any> {
    let u = new URLSearchParams();
    u.set('Descricao', chamado.Descricao.toString());
    u.set('Status', chamado.Status.toString());
    u.set('DataLimite', chamado.DataLimite.toString());
    u.set('DataPrevista', chamado.DataPrevista.toString());
    u.set('Telefone', chamado.Telefone.toString());

    return this.http.post<EntidadeResponse<Chamado>>(this.chamadoUrl, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Chamado>>('addChamado')));
  }

  deleteChamado(id: Number): Observable<any> {
    let url = `${this.chamadoUrl}/${id}`;
    return this.http.delete<EntidadeResponse<Chamado>>(url, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Chamado>>('deleteChamado')));
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