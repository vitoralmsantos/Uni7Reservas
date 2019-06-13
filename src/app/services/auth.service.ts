import { Injectable } from '@angular/core';
import { Usuario } from '../model/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

    public tokenKey: string = 'app_token';
    public userId: string = 'user_id';
    public objUsuario: string = 'objUsuario';

    public storeToken(content: Object) {
        localStorage.setItem(this.tokenKey, JSON.stringify(content));
    }

    public storeUserId(id: number) {
        if (id == null)
            localStorage.setItem(this.userId, '0');
        else
            localStorage.setItem(this.userId, id.toString());
    }

    public storeUsuario(usuario: Usuario) {
        localStorage.setItem(this.objUsuario, JSON.stringify(usuario));
    }

    public retrieveToken() {
        let storedToken: string = localStorage.getItem(this.tokenKey);
        if (storedToken === 'undefined' || storedToken == null)
            return '';
        else
            return storedToken;
    }

    public retrieveUserId() {
        let storedUserId: string = localStorage.getItem(this.userId);
        if (storedUserId === 'undefined' || storedUserId == null)
            return "0";
        else
            return storedUserId;
    }

    public retrieveUsuario() : Usuario {
        let usuario: Usuario = JSON.parse(localStorage.getItem(this.objUsuario))
        return usuario;
    }
}