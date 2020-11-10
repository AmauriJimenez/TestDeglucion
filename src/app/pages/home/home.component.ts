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
  listaEstados:any[] = [];
  usuario: usuarioModel;
  formEditarUsuario:FormGroup;

  constructor(private auth:AuthService, private router:Router, private formBuilder: FormBuilder) {
    this.crearFormulario();
  }

  ngOnInit() {
    this.usuario = new usuarioModel;

    setInterval( this.obtenerListaUsuarios,2000)

    this.auth.getEstados().subscribe((data:any) =>{
      this.listaEstados = data;
      this.listaEstados.unshift({ 'sts_Id': '', 'sts_Descripcion': 'Seleccione...' })
      //console.log(this.listaEstados)
    });
  }

  obtenerListaUsuarios(){
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
    //console.log(usuarioSeleccionado);
    this.formEditarUsuario = this.formBuilder.group({
      id:[usuarioSeleccionado.usr_Id, Validators.required],
      email:[usuarioSeleccionado.usr_Mail, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password:[usuarioSeleccionado.usr_Passwd, [Validators.required, Validators.minLength(8)]],
      fecha:[usuarioSeleccionado.usr_FechaVence, Validators.required],
      estado:[usuarioSeleccionado.usr_Estado, Validators.required]
    });

  }

  actualizarUsuario(){
    //console.log(this.formEditarUsuario.valid)
    if (this.formEditarUsuario.valid) {
        this.auth.actualizarUsuario(this.formEditarUsuario.value).subscribe(resp =>{
        console.log(resp);

        this.formEditarUsuario.reset

      })
    }else{
      if (!this.formEditarUsuario.valid) {
        return Object.values(this.formEditarUsuario.controls).forEach(controls => {
          if (controls instanceof FormGroup) {
            Object.values(controls.controls).forEach(control => control.markAsTouched());
          } else {
            controls.markAsTouched();
          }
        });
      }
    }
  }

  get validarId(){
    return this.formEditarUsuario.get('id').invalid && this.formEditarUsuario.get('id').touched
  }

  get validarEmail(){
    return this.formEditarUsuario.get('email').invalid && this.formEditarUsuario.get('email').touched
  }

  get validarPassword(){
    return this.formEditarUsuario.get('password').invalid && this.formEditarUsuario.get('password').touched
  }

  get validarFecha(){
    return this.formEditarUsuario.get('fecha').invalid && this.formEditarUsuario.get('fecha').touched
  }

  get validarEstado(){
    return this.formEditarUsuario.get('estado').invalid && this.formEditarUsuario.get('estado').touched
  }

  crearFormulario(){
    this.formEditarUsuario = this.formBuilder.group({
      id:[{value:'', disabled:true },Validators.required],
      email:['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password:['', [Validators.required, Validators.minLength(8)]],
      fecha:['', Validators.required],
      estado:['',Validators.required]
    });
  }


}
