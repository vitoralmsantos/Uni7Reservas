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
            resultado = "Apoio administrativo"
        }
        else if (tipo == 2){
            resultado = "Coordenador(a)"
        }
        else if (tipo == 3){
            resultado = "Professor(a)"
        }

        return resultado
    }

    public static permissao(tipo: TIPOUSUARIO, path: string): boolean {
        return (path === '/principal/reservaadmin' && tipo === TIPOUSUARIO.ADMIN)
            || (path === '/principal/relatorios/reservas' && tipo === TIPOUSUARIO.ADMIN)
            || (path === '/principal/relatorios/avaliacao' && tipo === TIPOUSUARIO.ADMIN)
            || (path === '/principal/admin/usuario' && tipo === TIPOUSUARIO.ADMIN)
            || (path === '/principal/admin/categoria' && tipo === TIPOUSUARIO.ADMIN)
            || (path === '/principal/admin/equipamento' && tipo === TIPOUSUARIO.ADMIN)
            || (path === '/principal/admin/local' && tipo === TIPOUSUARIO.ADMIN)
            || (path === '/principal/admin/recurso' && tipo === TIPOUSUARIO.ADMIN)
            || (path === '/principal/relatorios/reservas' && tipo === TIPOUSUARIO.SUPORTE)
    }
}

export enum TIPOUSUARIO {
    ADMIN = 0,
    SUPORTE = 1,
    COORDENADOR = 2,
    PROFESSOR = 3
}