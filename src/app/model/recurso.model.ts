export class Recurso {
    Id: number;
    Nome: string;
    Detalhes: string;
    Tipo: TIPORECURSO;
}

enum TIPORECURSO {
    HARDWARE = 0,
    SOFTWARE = 1,
    OUTRO = 2
}