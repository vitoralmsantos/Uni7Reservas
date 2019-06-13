import { BaseResponse } from './base.response'
import { Usuario } from 'src/app/model/usuario.model';

export class TokenResponse extends BaseResponse {
	Token: string
    UserID: number
    Usuario: Usuario
}