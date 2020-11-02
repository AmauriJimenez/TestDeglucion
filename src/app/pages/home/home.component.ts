import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { usuarioModel } from 'src/app/models/usuario.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  listaUsuarios:[] = [];
  usuario: usuarioModel;
  formEditarUsuario:FormGroup;


  constructor(private auth:AuthService, private router:Router, private formBuilder: FormBuilder) {
    this.crearFormulario();
  }

  ngOnInit() {
    this.usuario = new usuarioModel;


    this.auth.getUsuarios().subscribe((data:any) =>{
      this.listaUsuarios = data;
      //console.log(this.listaUsuarios);
    });
  }

  salir(){
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  editarUsuario(usuarioSeleccionado: usuarioModel){
    this.usuario = usuarioSeleccionado;
    console.log(this.usuario);

    this.formEditarUsuario = this.formBuilder.group({
      id:[{value:usuarioSeleccionado.usr_Id}, Validators.required],
      email:[{value:usuarioSeleccionado.usr_Mail}, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password:[{value:usuarioSeleccionado.usr_Passwd}, [Validators.required, Validators.minLength(8)]],
      fecha:[{value:usuarioSeleccionado.usr_FechaVence}, Validators.required]
    });

    console.log(usuarioSeleccionado.usr_Id);

  }

  actualizarUsuario(){

  }

  getValidarId(){
    return this.formEditarUsuario.get('id').invalid && this.formEditarUsuario.get('id').touched
  }

  getValidarEmail(){
    return this.formEditarUsuario.get('email').invalid && this.formEditarUsuario.get('email').touched
  }

  getValidarPassword(){
    return this.formEditarUsuario.get('password').invalid && this.formEditarUsuario.get('password').touched
  }

  getValidarFecha(){
    return this.formEditarUsuario.get('fecha').invalid && this.formEditarUsuario.get('fecha').touched
  }

  crearFormulario(){
    this.formEditarUsuario = this.formBuilder.group({
      id:[{value:''}, Validators.required],
      email:[{value:''}, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password:[{value:''}, [Validators.required, Validators.minLength(8)]],
      fecha:[{value:''}, Validators.required]
    });
  }


}
