import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-resset-pass',
  templateUrl: './resset-pass.page.html',
  styleUrls: ['./resset-pass.page.scss'],
})
export class RessetPassPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
//============== Funcion para enviar reset de password ==============
  async ressetPass(){
    await this.authService.ressetpassword(this.credentials.value)
    .then(()=>{
      this.showAlert('Mail enviado', 'Revisa tu correo para cambiar tu contraseña')
    })
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
}
