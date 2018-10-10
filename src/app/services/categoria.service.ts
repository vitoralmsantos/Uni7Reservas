import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { CategoriasResponse } from './response/categorias.response';
import { CategoriaResponse } from './response/categoria.response';
import { Categoria } from '../model/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {

  readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  };

  private categoriaUrl = 'http://localhost:51859/api/categoria';

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<CategoriasResponse> {
    return this.http.get<CategoriasResponse>(this.categoriaUrl)
      .pipe(catchError(this.handleError<CategoriasResponse>('getCategorias')));
  }

  getCategoria(id: number): Observable<CategoriaResponse> {
    const url = `${this.categoriaUrl}/consulta/${id}`;
    return this.http.get<CategoriaResponse>(url)
      .pipe(catchError(this.handleError<CategoriaResponse>(`getCategoria id=${id}`)));
  }

  //Consulta categorias disponíveis para reservas
  getDisponibilidade(data: string, horario: string, turno: string): Observable<CategoriasResponse> {
    let url = `${this.categoriaUrl}/disponibilidade/?data=${data}&horario=${horario}&turno=${turno}`;
    return this.http.get<CategoriasResponse>(url)
      .pipe(catchError(this.handleError<CategoriasResponse>('getDisponibilidade')));
  }

  updateCategoria(categoria: Categoria): Observable<any> {
    let u = new URLSearchParams();
    u.set('Id', categoria.Id.toString());
    u.set('Nome', categoria.Nome.toString());

    let url = `${this.categoriaUrl}/${categoria.Id}`;
    return this.http.put<CategoriaResponse>(url, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<CategoriaResponse>('updateCategoria')));
  }
  
  addCategoria(categoria: Categoria): Observable<any> {
    let u = new URLSearchParams();
    u.set('Nome', categoria.Nome.toString());

    return this.http.post<CategoriaResponse>(this.categoriaUrl, u.toString(), this.httpOptions)
      .pipe(catchError(this.handleError<CategoriaResponse>('addCategoria')));
  }

  deleteCategoria(id: Number): Observable<any> {
    let url = `${this.categoriaUrl}/${id}`;
    return this.http.delete<CategoriaResponse>(url, this.httpOptions)
      .pipe(catchError(this.handleError<CategoriaResponse>('deleteCategoria')));
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