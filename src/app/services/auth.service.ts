import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { usuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url:string = "http://157.245.128.127/tdl/back-web/servicios/";
  userToken:string ="";


  constructor(private http: HttpClient) {
    this.getToken;
  }

  logout(){
    localStorage.removeItem('Token');
    localStorage.removeItem('adm_Nombre');
    localStorage.removeItem('adm_Id');
    localStorage.removeItem('Expira');
  }

  login(usuario: usuarioModel){
    const authData = {
      "email": usuario.usr_Mail,
      "password": usuario.usr_Passwd,
      returnSecureToken: true
    }
    return this.http.post<any>(`${this.url}login.php`,authData).pipe(map(resp =>{
      this.guardarToken(resp['idToken']);
      localStorage.setItem("adm_Nombre",resp['adm_Nombre']);
      localStorage.setItem("adm_Id",resp['adm_Id']);
      //console.log(resp);

      return resp;
    })
    );
  }

  nuevoUsuario(usuario: usuarioModel){
    const authData = {
      email: usuario.usr_Mail,
      password: usuario.usr_Passwd,
      fecha: usuario.usr_FechaVence
    }
    return this.http.post(`${this.url}nuevoUsuario.php`,authData).pipe(map(resp =>{
      return resp;
    })
    );
  }

  getUsuarios(){
    return this.http.get(`${this.url}listaDeUsuarios.php`);
  }

  private guardarToken(idToken:string){
    this.userToken = idToken
    localStorage.setItem('Token',idToken)

    let hoy = new Date();
    hoy.setSeconds(3600)
    localStorage.setItem('Expira', hoy.getTime().toString())
  }

  getToken(){
    if(localStorage.getItem('Token')){
      this.userToken = localStorage.getItem('Token');
    }else{
      this.userToken = '';
    }
    return this.userToken;
  }

  verificarLogin(): boolean{
    this.userToken = localStorage.getItem('Token');

    //console.log(this.userToken);

    if (this.userToken === null) {
      return false;
    } else {
      const expira = Number(localStorage.getItem('Expira'));
      const expiraDate = new Date();
      expiraDate.setTime(expira)

      if (expiraDate > new Date()) {
        return true;
      }else{
        return false;
      }
    }

  }

}
