export class Equipamento {
    Id: number;
    Serie: string;
    Modelo: string;
    Disponivel: boolean;
    IdCategoria: number;
    TipoBoolean: string;

    public static TipoBoolean(boolean: Boolean): string {
        let resultado = ''
    
        if (boolean == false) {
            resultado = "Não"
        }
        else if (boolean == true) {
            resultado = "Sim"
        }
    
        return resultado
    }
}



