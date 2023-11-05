import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { error } from 'console';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  respuesta:any;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  //Funcion para acceder a campo email
  get email() {
    return this.credentials.get('email');
  }

  //Funcion para acceder a campo email
  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  //============== Funcion para realizar el login ==============
  async login(){
    const loading = await this.loadingController.create();
    await loading.present();
    try{
      await this.authService.login(this.credentials.value).then(
        res=>{
          this.respuesta = res;
        }
      ).catch(e=>{
        throw new Error();
      }
      );
      await this.getUserInfo(this.respuesta.user.uid);
      this.router.navigate(['home']);
    }
    catch (error){
      this.showAlert('Login fallido', "Intenta de nuevo, máquina");
    }
    await loading.dismiss();
    
  } 
//============== Funcion de alerta ==============
  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  //============== Funcion obtener y guardar usuario en el localstorage ==============
  async getUserInfo(uid: string){
    try{
      if (this.credentials.valid) {
        const loading = await this.loadingController.create();
        await loading.present();
  
        let path =`users/${uid}`;
  
        await this.authService.getDocument(path).then(user => {
          this.localStorageService.saveInLocalStorage('user', user);
        });
  
        await loading.dismiss();
      }
    }
    catch (error){
      throw new Error("Intenta de nuevo, máquina");
    }
  }
}
