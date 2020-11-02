import { Component, OnInit } from '@angular/core';
import { usuarioModel } from 'src/app/models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: usuarioModel;
  recordarme:boolean = false

  constructor(private auth: AuthService, private router:Router) { }

  ngOnInit() {
    this.usuario = new usuarioModel;

  }

  onSubmit(formularioRegistro: NgForm){
    if (formularioRegistro.valid) {
      Swal.fire({
        allowOutsideClick:false,
        title:'Cargando',
        text:'Espere por favor'
      });
      Swal.showLoading();
      this.auth.nuevoUsuario(this.usuario).subscribe(resp =>{
        console.log(resp);
        Swal.close();
        if(this.recordarme){
          localStorage.setItem('Email',this.usuario.usr_Mail);
        }
        this.router.navigateByUrl('/home')
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
