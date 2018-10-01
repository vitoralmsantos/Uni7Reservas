import { BaseResponse } from './base.response'
import { Recurso } from '../../model/recurso.model'

export class RecursosResponse extends BaseResponse {
	Recursos : Recurso[];
}