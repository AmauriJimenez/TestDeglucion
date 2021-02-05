import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
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
  formLogin:FormGroup;

  constructor(private auth:AuthService, private router:Router, private formBuilder:FormBuilder) {
    this.crearFormularioLogin();
  }

  ngOnInit() {
    this.usuario = new usuarioModel;
    //console.log(localStorage.getItem('Token'));

    if (localStorage.getItem('Token') != null) {
      this.usuario.token = localStorage.getItem('token');
      this.recordarme = true;
    }

  }

  get validarUsuario(){
    return this.formLogin.get('username').invalid && this.formLogin.get('username').touched
  }

  get validarPasswd(){
    return this.formLogin.get('passwordLogin').invalid && this.formLogin.get('passwordLogin').touched
  }

  crearFormularioLogin(){
    this.formLogin = this.formBuilder.group({
      username:['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      passwordLogin:['', Validators.required]
    });
  }

  login(){
    //console.log(this.formLogin.valid);

    if(this.formLogin.valid){
      //console.log(this.usuario);
      Swal.fire({
        allowOutsideClick:false,
        title:'Cargando',
        text:'Espere por favor'
      });
      Swal.showLoading();
      //console.log(this.formLogin.value)

      const username = this.formLogin.get('username').value;
      const passwordLogin = this.formLogin.get('passwordLogin').value;

      this.auth.login(username, passwordLogin).subscribe(resp =>{
        //console.log(resp['resp']);
        Swal.close();
        if(this.recordarme){
          localStorage.setItem('Email',this.usuario.usr_Mail);
        }

        switch (resp['resp']) {
          case 100:
            this.router.navigateByUrl('/')
          break;

          case 203:
            Swal.fire({
              title:'Error',
              text:'Usuario o contraseña invalidos.',
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
              text:'El usuario no se encuentra habilitado, comuniquese con el administrador.',
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
    }else{
      return Object.values(this.formLogin.controls).forEach(controls =>{
        if (controls instanceof FormGroup) {
          Object.values(controls.controls).forEach(control => control.markAllAsTouched());
        }else{
          controls.markAsTouched();
        }
      });
    }
  }

}
