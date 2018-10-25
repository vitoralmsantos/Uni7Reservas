export class Local {
    Id: number;
    Nome: string;
    Reservavel: boolean;
    Disponivel: boolean;
    Tipo: TIPOLOCAL;
    TipoLocal: String;
    TipoReservavel: String

    public static tipoReservavel(tipo: boolean): String {
        let resultado = ''

        if (tipo == false) {
            resultado = "Não"
        }

        else {
            resultado = "Sim"
        }

        return resultado

    }

    public static tipoLocal(tipo: number): String {
        let resultado = ''

        if (tipo == 0) {
            resultado = "Laboratorio"
        }
        else if (tipo == 1) {
            resultado = "Sala"
        }
        else if (tipo == 2) {
            resultado = "Auditorio"
        }

        return resultado
    }
}


export enum TIPOLOCAL {
    LABORATORIO = 0,
    SALA = 1,
    AUDITORIO = 2
}