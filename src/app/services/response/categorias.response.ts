import { BaseResponse } from './base.response'
import { Categoria } from '../../model/categoria.model'

export class CategoriasResponse extends BaseResponse {
	Categorias : Categoria[];
}