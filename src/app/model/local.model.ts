export class Local {
    Id: number;
    Nome: string;
    Reservavel: boolean;
    Disponivel: boolean;
    Tipo: TIPOLOCAL;
}

enum TIPOLOCAL {
    LABORATORIO = 0,
    SALA = 1,
    AUDITORIO = 2
}