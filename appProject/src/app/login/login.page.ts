import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

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


  async login(){
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.login(this.credentials.value);
    await this.getUserInfo(user.user.uid);
    
    if(user) {
      this.router.navigateByUrl('/home', {replaceUrl: true});
    } else {
      this.showAlert('Login fallido', 'Intenta de nuevo maquina');
    }
    await loading.dismiss();
  } 

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async getUserInfo(uid: string){
    if (this.credentials.valid) {
      const loading = await this.loadingController.create();
      await loading.present();

      let path =`users/${uid}`;

      this.authService.getDocument(path).then(user => {
        this.localStorageService.saveInLocalStorage('user', user);
      });

      await loading.dismiss();
    }
  }
}
