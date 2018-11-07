export class Reserva {
    Id: number
    Data: string
    Horario: string
    Turno: string
    TurnoExtenso: string
    NumDataHorarioTurno: number
    Obs: string
    IdLocal: number
    NomeLocal: string
    IdUsuario: number
    NomeUsuario: string
    EmailUsuario: string
    IdEquipamentos: number[]
    Equipamentos: string[]
    ReservadoEm: string
    ComentarioUsuario: string
    Satisfacao: number
    ExibeAvaliacao: boolean

    public static turnoExtenso(turno: string): string {
        if (turno == 'M') {
            return 'Manhã'
        }
        else if (turno == 'T') {
            return 'Tarde'
        }
        else if (turno == 'N') {
            return 'Noite'
        }
        return ''
    }

    public static numDataHorarioTurno(data: string, horario: string, turno: string): number {
        let num: string = data.substr(6, 4) + data.substr(3, 2) + data.substr(0, 2)

        if (turno == 'M' && horario == 'AB') {
            num = num + '1'
        }
        else if (turno == 'M' && horario == 'CD') {
            num = num + '2'
        }
        else if (turno == 'M' && horario == 'EF') {
            num = num + '3'
        }
        else if (turno == 'T' && horario == 'AB') {
            num = num + '4'
        }
        else if (turno == 'T' && horario == 'CD') {
            num = num + '5'
        }
        else if (turno == 'T' && horario == 'EF') {
            num = num + '6'
        }
        else if (turno == 'N' && horario == 'AB') {
            num = num + '7'
        }
        else if (turno == 'N' && horario == 'CD') {
            num = num + '8'
        }
        return parseInt(num)
    }

    public static horarioTurno(num: number) {
        if (num == 1) {
            return 'Manhã AB'
        }
        else if (num == 2) {
            return 'Manhã CD'
        }
        else if (num == 3) {
            return 'Manhã EF'
        }
        else if (num == 4) {
            return 'Tarde AB'
        }
        else if (num == 5) {
            return 'Tarde CD'
        }
        else if (num == 6) {
            return 'Tarde EF'
        }
        else if (num == 7) {
            return 'Noite AB'
        }
        else if (num == 8) {
            return 'Noite CD'
        }
    }
}
