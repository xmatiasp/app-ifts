import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  get email() {
    return this.credentials.get('email');
  }

  //Funcion para acceder a campo email
  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    
    this.credentials = this.fb.group({
      uid: new FormControl(''),
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async register(){
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.register(this.credentials.value);
    await this.authService.updateUser(this.credentials.value.name);

    let uid= user.user.uid;
    this.credentials.controls['uid'].setValue(uid);
    this.setUserInfo(uid);

    await loading.dismiss();

    if(user) {
      this.router.navigateByUrl('/home', {replaceUrl: true});
    } else {
      this.showAlert('Registro fallido', 'Intenta de nuevo maquina');
    }
  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
  
  async setUserInfo(uid: string){
    if (this.credentials.valid) {
      const loading = await this.loadingController.create();
      await loading.present();

      let path =`users/${uid}`;
      delete this.credentials.value.password;

      this.authService.setDocument(path, this.credentials.value).then(async res=>{
        this.localStorageService.saveInLocalStorage('user', this.credentials.value);
      });

      await loading.dismiss();
    }
  }
}
