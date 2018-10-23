

export class Equipamento {
    Id: number;
    Serie: string;
    Modelo: string;
    Disponivel: boolean;
    IdCategoria: number;
    TipoBoolean: string;
    NomeCategoria: String;


    public static TipoBoolean(tipo: boolean): string {
        let resultado = ''
    
        if (tipo == false) {
            resultado = "Não"
        }
        else if (tipo == true) {
            resultado = "Sim"
        }
    
        return resultado
    }
}



