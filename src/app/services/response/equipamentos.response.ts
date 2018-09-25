import { BaseResponse } from './base.response'
import { Equipamento } from '../../model/equipamento.model'

export class EquipamentosResponse extends BaseResponse {
	Equipamentos : Equipamento[];
}