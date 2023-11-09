import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  constructor(private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private navCtrl: NavController
    ) { }

  ngOnInit() {
  }

  navigate(destino){
    this.navCtrl.navigateRoot(destino);
  }

  user(){
    return this.localStorageService.getFromLocalStorage('user');
  }

//============== Condicion para mostrar si la imagen se tomo con exito ==============
  async takePicture(){
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader: 'Eliga una opción',
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Toma una foto'
    });
  }
//============== Funcion para tomar y guardar la foto ==============
  async takeImage(){

    let user = this.user();
    let path = `users/${user.uid}`

    try{
      const dataUrl = ((await this.takePicture()).dataUrl);
      let imagePath = `${user.uid}/perfil`;
      user.image = await this.authService.uploadImage(imagePath, dataUrl);

      const loading = await this.loadingController.create();
      await loading.present();

        await this.authService.updateDocument(path, {image: user.image});
        this.localStorageService.saveInLocalStorage('user', user);
        this.showAlert('Exito!', 'Se guardo la imagen correctamente');
        await loading.dismiss();
    }
    catch (error){
      this.showAlert('Guardado fallido: ', error.message+'. Por favor intene otra vez mas tarde.');
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
