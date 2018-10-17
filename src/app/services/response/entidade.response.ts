import { BaseResponse } from './base.response'

export class EntidadeResponse<T> extends BaseResponse {
	Elemento : T;
}