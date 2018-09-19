export class Usuario {
    Id: number;
    Nome: string;
    Email: string;
    Tipo: TIPOUSUARIO;
}

enum TIPOUSUARIO {
    ADMIN = 0,
    SECRETARIO = 1,
    COORDENADOR = 2,
    PROFESSOR = 3,
    BOLSISTA = 4
}
