import { BaseResponse } from './base.response'
import { Reserva } from '../../model/reserva.model'

export class ReservasResponse extends BaseResponse {
	Reservas : Reserva[];
}