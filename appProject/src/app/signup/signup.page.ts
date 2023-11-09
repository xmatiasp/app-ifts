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
  //Funcion para acceder a campo email
  get email() {
    return this.credentials.get('email');
  }

  //Funcion para acceder a campo password
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
//============== Funcion para realizar el registro ==============
  async register(){
    const loading = await this.loadingController.create();
    await loading.present();

    try{
      if(this.credentials.get('name').value=='' || this.credentials.get('email').value=='' || this.credentials.get('password').value==''
      || !this.credentials.get('email').value.includes('@') || !this.credentials.get('email').value.includes('.')
      ){
        throw new Error();
      }
      const user = await this.authService.register(this.credentials.value);
      await this.authService.updateUser(this.credentials.value.name);
  
      let uid= user.user.uid;
      this.credentials.controls['uid'].setValue(uid);
      await this.setUserInfo(uid);
  
      await loading.dismiss();
  
      if(user) {
        this.router.navigateByUrl('/home', {replaceUrl: true});
      } else {
        this.showAlert('Registro fallido', 'Intenta de nuevo, máquina');
      }
    }
    catch(error){
      this.showAlert('Registro fallido', 'Complete los campos requeridos de manera correcta por favor');
      await loading.dismiss();
    }

  }
//============== Alerta ==============
  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
  //============== Guardar en la base de datos el nuevo usuario y guardarlo en localStorage ==============
  async setUserInfo(uid: string){
    if (this.credentials.valid) {
      const loading = await this.loadingController.create();
      await loading.present();

      let path =`users/${uid}`;
      delete this.credentials.value.password;

      await this.authService.setDocument(path, this.credentials.value).then(async res=>{
        this.localStorageService.saveInLocalStorage('user', this.credentials.value);
      });

      await loading.dismiss();
    }
  }
}
