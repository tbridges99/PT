
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import {tokenNotExpired} from 'angular2-jwt'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    authToken: any;
    user: any;

    constructor(private http:HttpClient) { }

    registerUser(user){
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        return this.http.post('https://localhost:3000/users/register',
        user, {headers:headers});
    }

    authenticateUser(user){
        console.log(user);
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        return this.http.post('https://localhost:3000/users/authenticate',
        user, {headers:headers});
    }

    getProfile(){
        this.loadToken();
        let headers = new  HttpHeaders({
            'Authorization':this.authToken,
            'Content-Type':'application/json'
        });
        return this.http.get('https://localhost:3000/users/profile',{headers:headers});
    }

    storeUserData(token, user){
        localStorage.setItem('id_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.authToken = token;
        this.user = user;
    }

    loadToken(){
        const token = localStorage.getItem('id_token');
        this.authToken = token;
    }

    loggedIn(){
        return tokenNotExpired('id_token');
    }

    logout(){
        this.authToken = null;
        this.user = null;
        localStorage.clear();
    }
}
