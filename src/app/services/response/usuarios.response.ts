import { BaseResponse } from './base.response'
import { Usuario } from '../../model/usuario.model'

export class UsuariosResponse extends BaseResponse {
	Usuarios : Usuario[];
}