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

    public static permissao(tipo: TIPOUSUARIO, path: string): boolean {
        return (path === '/principal/relatorios/reservas' && tipo === TIPOUSUARIO.ADMIN)
            || (path === '/principal/relatorios/avaliacao' && tipo === TIPOUSUARIO.ADMIN)
            || (path === '/principal/admin/usuario' && tipo === TIPOUSUARIO.ADMIN)
            || (path === '/principal/admin/categoria' && tipo === TIPOUSUARIO.ADMIN)
            || (path === '/principal/admin/equipamento' && tipo === TIPOUSUARIO.ADMIN)
            || (path === '/principal/admin/local' && tipo === TIPOUSUARIO.ADMIN)
            || (path === '/principal/admin/recurso' && tipo === TIPOUSUARIO.ADMIN)
            || (path === '/principal/relatorios/reservas' && tipo === TIPOUSUARIO.BOLSISTA)
            || (path === '/principal/relatorios/reservas' && tipo === TIPOUSUARIO.SECRETARIO)
    }
}

enum TIPOUSUARIO {
    ADMIN = 0,
    SECRETARIO = 1,
    COORDENADOR = 2,
    PROFESSOR = 3,
    BOLSISTA = 4
}