export class Reserva {
    Id: number;
    Data: string;
    Horario: string;
    ReservadoEm: string;
    Turno: string;
    TurnoExtenso: string;
    Obs: string;
    NomeLocal: string;
    NomeUsuario: string;
    EmailUsuario: string;
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
