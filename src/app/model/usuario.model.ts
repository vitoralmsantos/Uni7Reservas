export class Usuario {
    Id: number;
    Nome: string;
    Email: string;
    Tipo: TIPOUSUARIO;
    TipoExtenso: string;

    public static tipoExtenso(tipo: TIPOUSUARIO): string {
        let resultado = ''
        switch (tipo) {
            case TIPOUSUARIO.ADMIN:
                resultado = "Administrador(a)"
                break
            case TIPOUSUARIO.SECRETARIO:
                resultado = "Secretário(a)"
                break
            case TIPOUSUARIO.COORDENADOR:
                resultado = "Coordenador(a)"
                break
            case TIPOUSUARIO.PROFESSOR:
                resultado = "Professor(a)"
                break
            case TIPOUSUARIO.BOLSISTA:
                resultado = "Bolsista"
                break
            default: resultado = ""
        }
alert(tipo + ' ' + resultado)
        return resultado
    }
}

enum TIPOUSUARIO {
    ADMIN = 0,
    SECRETARIO = 1,
    COORDENADOR = 2,
    PROFESSOR = 3,
    BOLSISTA = 4
}