import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { usuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usuario: usuarioModel;
  adm_Nombre: string;
  formNuevoUsuario:FormGroup;

  constructor(private auth:AuthService, private router:Router, private formBuilder: FormBuilder) {
    this.crearFormulario()
  }

  ngOnInit(): void {
    this.usuario = new usuarioModel;
    this.adm_Nombre = localStorage.getItem('adm_Nombre');
  }

  get validarPassword(){
    return this.formNuevoUsuario.get('password').invalid && this.formNuevoUsuario.get('password').touched
  }

  get validarEmail(){
    return this.formNuevoUsuario.get('email').invalid && this.formNuevoUsuario.get('email').touched
  }

  get validarFecha(){
    return this.formNuevoUsuario.get('fecha').invalid && this.formNuevoUsuario.get('fecha').touched
  }

  crearFormulario(){
    this.formNuevoUsuario = this.formBuilder.group({
      email:['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password:['', [Validators.required, Validators.minLength(8)]],
      fecha:['', Validators.required]
    });
  }

  salir(){
    this.auth.logout();
    this.router.navigateByUrl('login');
  }

  nuevoUsuario(){
    if (!this.formNuevoUsuario.valid) {
      return Object.values(this.formNuevoUsuario.controls).forEach(controls => {
        if (controls instanceof FormGroup) {
          Object.values(controls.controls).forEach(control => control.markAsTouched());
        } else {
          controls.markAsTouched();
        }
      });
    } else {
      if (this.formNuevoUsuario.valid) {
        this.auth.nuevoUsuario(this.formNuevoUsuario.value).subscribe(resp => {
          switch (resp) {
            case 201:
              Swal.fire({
                title:"Usuario Creado",
                icon:"success"
              });
            break;
            case 302:
              Swal.fire({
                title:"Error",
                text:"Este correo ya esta registrado",
                icon:"error"
              });
            break;
            case 406:
              Swal.fire({
                title:"Error 406",
                text:"Error en la direccion de correo.",
                icon:"warning"
              });
            break;
            case 500:
              Swal.fire({
                title:"Error 500",
                text:"Error en el servidor, comiquese con el administrador del sistema",
                icon:"error"
              });
            break;
            case 503:
              Swal.fire({
                title:"Error 503",
                text:"Comuniquese con el administrador del sistema",
                icon:"warning"
              });
            break;
            default:
              Swal.fire({
                title:"Error no controlado, comuniquese oon el administrador del sistema.",
                icon:"error"
              });
              break;
          }
        });

        //201 Proceso Ejecutado
        //302 Registro ya encontrado
        //406 Falta informacion
        //500 Error en el sql
        //503 Posible inyeccion de perfil invalido

      }
    }
  }



}
