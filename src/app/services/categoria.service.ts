import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { EntidadesResponse } from './response/entidades.response';
import { EntidadeResponse } from './response/entidade.response';
import { Categoria } from '../model/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {

  readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  };

  private categoriaUrl = 'http://localhost:51859/api/categoria';

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<EntidadesResponse<Categoria>> {
    return this.http.get<EntidadesResponse<Categoria>>(this.categoriaUrl)
      .pipe(catchError(this.handleError<EntidadesResponse<Categoria>>('getCategorias')));
  }

  getCategoria(id: number): Observable<EntidadeResponse<Categoria>> {
    const url = `${this.categoriaUrl}/consulta/${id}`;
    return this.http.get<EntidadeResponse<Categoria>>(url)
      .pipe(catchError(this.handleError<EntidadeResponse<Categoria>>(`getCategoria id=${id}`)));
  }

  //Consulta categorias disponíveis para reservas
  getDisponibilidade(data: string, horario: string, turno: string): Observable<EntidadesResponse<Categoria>> {
    let url = `${this.categoriaUrl}/disponibilidade/?data=${data}&horario=${horario}&turno=${turno}`;
    return this.http.get<EntidadesResponse<Categoria>>(url)
      .pipe(catchError(this.handleError<EntidadesResponse<Categoria>>('getDisponibilidade')));
  }

  updateCategoria(categoria: Categoria): Observable<any> {
    let u = new URLSearchParams();
    u.set('Id', categoria.Id.toString());
    u.set('Nome', categoria.Nome.toString());

    let url = `${this.categoriaUrl}/${categoria.Id}`;
    return this.http.put<EntidadeResponse<Categoria>>(url, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Categoria>>('updateCategoria')));
  }
  
  addCategoria(categoria: Categoria): Observable<any> {
    let u = new URLSearchParams();
    u.set('Nome', categoria.Nome.toString());

    return this.http.post<EntidadeResponse<Categoria>>(this.categoriaUrl, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Categoria>>('addCategoria')));
  }

  deleteCategoria(id: Number): Observable<any> {
    let url = `${this.categoriaUrl}/${id}`;
    return this.http.delete<EntidadeResponse<Categoria>>(url, this.httpOptions)
      .pipe(catchError(this.handleError<EntidadeResponse<Categoria>>('deleteCategoria')));
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