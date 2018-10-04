export class Usuario {
    Id: number;
    Nome: string;
    Email: string;
    Tipo: TIPOUSUARIO;
    TipoExtenso: string;

    public static tipoExtenso(tipo: TIPOUSUARIO): string {
        let resultado = ''
        
        if (tipo == 0){
            resultado = "Administrador(a)"
        }
        else if (tipo == 1){
            resultado = "Secretário(a)"
        }
        else if (tipo == 2){
            resultado = "Coordenador(a)"
        }
        else if (tipo == 3){
            resultado = "Professor(a)"
        }
        else if (tipo == 4){
            resultado = "Bolsista"
        }

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