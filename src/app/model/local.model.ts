export class Local {
    Id: number;
    Reservavel: boolean;
    Disponivel: boolean;
    Tipo: TIPOLOCAL;
}

enum TIPOLOCAL {
    LABORATORIO = 0,
    SALA = 1,
    AUDITORIO = 2
}