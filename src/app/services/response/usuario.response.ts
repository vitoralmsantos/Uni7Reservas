import { BaseResponse } from './base.response'
import { Usuario } from '../../model/usuario.model'

export class UsuarioResponse extends BaseResponse {
	Usuario : Usuario;
}