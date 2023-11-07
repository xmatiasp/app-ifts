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
    private alertController: AlertController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
//============== Funcion para enviar reset de password ==============
async ressetPass() {
  if (this.credentials.value.email && this.credentials.value.email.includes('@') 
  && this.credentials.value.email.includes('.')) {
    try {
      await this.authService.ressetpassword(this.credentials.value)
      .then(() => {
        this.showAlert('Mail enviado', 'Revisa tu correo para cambiar la contraseña');
      });
    } catch (error) {
      console.error('Error inesperado:', error);
    }
  } else {
    // Muestra una alerta si el campo de correo electrónico está vacío
    this.showAlert('Error', 'Por favor, ingresa una dirección de correo electrónico valida');
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
}
