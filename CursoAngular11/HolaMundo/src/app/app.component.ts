import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  nombre ='Daniela'
  placeHolder ='Escriba Algo aqui '
  deshabilitado = true;
  imgSrc = 'https://img2.freepng.es/20180427/glq/kisspng-angularjs-typescript-javascript-5ae2d744932ac5.9966023615248156846028.jpg'
  listEstudiantes:any[] =[
    {nombre:'Tomas Gonzales' ,estado: 'Promocionado'},
    {nombre:'Jesus Ocampo' ,estado: 'Regular'},
    {nombre:'Andres Gonzales' ,estado: 'Libre'},
  ]
  mostrar =true;
  constructor(){
    setInterval(()=> this.deshabilitado = false ,3000)

  }

getSuma(numero1:number,number2:number){
  return numero1+number2
}

toogle(){
this.mostrar = !this.mostrar
}
}

