import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  constructor(private auth:AuthService, private router:Router) { }

  ngOnInit(): void {
    this.usuario = new usuarioModel;
    this.adm_Nombre = localStorage.getItem('adm_Nombre');
  }

  salir(){
    this.auth.logout();
    this.router.navigateByUrl('login');
  }

  nuevoUsuario(fomularioNuevoUsuario: NgForm){

    if (fomularioNuevoUsuario.valid) {
      //console.log(fomularioNuevoUsuario.value)
      this.auth.nuevoUsuario(this.usuario).subscribe(resp => {
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
