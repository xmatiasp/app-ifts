import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  //============== Funcion para guardar en localstorage ==============
  saveInLocalStorage(key: string, value: any){
    return localStorage.setItem(key, JSON.stringify(value));
  }
  //============== Funcion para obtener del localstorage ==============
  getFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key));
  }
  //============== Funcion para eliminar del localstorage ==============
  removeFromLocalStorage(key: string){
    if(localStorage.getItem(key)){
      localStorage.removeItem(key);
    }
  }
}
