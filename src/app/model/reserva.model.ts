export class Reserva {
    Id: number;
    Data: string;
    Horario: string;
    ReservadoEm: string;
    Turno: string;
    TurnoExtenso: string;
    Obs: string;
    IdLocal: number;
    NomeLocal: string;
    IdUsuario: number;
    NomeUsuario: string;
    EmailUsuario: string;
    IdEquipamentos: number[];
    Equipamentos: string[];

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
}
