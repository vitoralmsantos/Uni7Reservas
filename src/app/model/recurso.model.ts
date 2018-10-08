export class Recurso {
    Id: number;
    Nome: string;
    Detalhes: string;
    Vencimento: string;
    Tipo: TIPORECURSO;
}

enum TIPORECURSO {
    HARDWARE = 0,
    SOFTWARE = 1,
    OUTRO = 2
}