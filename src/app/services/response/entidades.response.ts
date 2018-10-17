import { BaseResponse } from './base.response'

export class EntidadesResponse<T> extends BaseResponse {
	Elementos : T[];
}