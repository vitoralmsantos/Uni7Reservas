import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private tokenKey: string = 'app_token';
    private userId: string = 'user_id';

    public storeToken(content: Object) {
        localStorage.setItem(this.tokenKey, JSON.stringify(content));
    }

    public storeUserId(id: number) {
        localStorage.setItem(this.userId, id.toString());
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
}