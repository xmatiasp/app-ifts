import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  saveInLocalStorage(key: string, value: any){
    return localStorage.setItem(key, JSON.stringify(value));
  }
  getFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key));
  }
  removeFromLocalStorage(key: string){
    if(localStorage.getItem(key)){
      localStorage.removeItem(key);
    }
  }
}
