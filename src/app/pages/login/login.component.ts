import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { usuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import  Swal  from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: usuarioModel;
  recordarme:boolean = false;
  constructor(private auth:AuthService, private router:Router) {}

  ngOnInit() {
    this.usuario = new usuarioModel;
    //console.log(localStorage.getItem('Token'));


    if (localStorage.getItem('Token') != null) {
      this.usuario.token = localStorage.getItem('token');
      this.recordarme = true;
    }

  }

  login(formularioLogin: NgForm){
    if(formularioLogin.valid){
      //console.log(this.usuario);
      Swal.fire({
        allowOutsideClick:false,
        title:'Cargando',
        text:'Espere por favor'
      });
      Swal.showLoading();
      this.auth.login(this.usuario).subscribe(resp =>{
        //console.log(resp['resp']);
        Swal.close();
        if(this.recordarme){
          localStorage.setItem('Email',this.usuario.usr_Mail);
        }

        switch (resp['resp']) {
          case 100:
            this.router.navigateByUrl('/home')
          break;

          case 203:
            Swal.fire({
              title:'Error',
              text:'Usuario o contraseña invalido.',
              icon:"error"

            });
          break;

          case 307:
            Swal.fire({
              title:'Error',
              text:'Error 307 comuniquese con el administrador del sistema',
              icon:"error"

            });
          break;

          case 401:
            Swal.fire({
              title:'Error',
              text:'El no se encuentra habilitado, comuniquese con el administrador.',
              icon:"error"

            });
          break;

          default:
            Swal.fire({
              title:'Error',
              text:'Error no controlado, comunicate con el administrador del sistema',
              icon:"error"

            });
            break;
        }

        //100 Continuar con el login
        //203 No autorizado
        //307 Redireccion temporal (hasta que cambie la contraseña)
        //401 la contraseña y el usuario no son correctos
        //500 Error en el servidor

      },(error)=>{
        console.log(error);
        Swal.fire({
          title: 'Error!',
          text: error.error.error.message,
          icon: 'error',
          confirmButtonText: 'Cool'
        });
      });
    }
  }

}
