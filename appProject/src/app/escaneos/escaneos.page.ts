import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Escaneo } from '../models/escaneo.model';
import { AlertController, LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-escaneos',
  templateUrl: './escaneos.page.html',
  styleUrls: ['./escaneos.page.scss'],
})
export class EscaneosPage implements OnInit {

  //============== Array de escaneos ==============
  escaneos: Escaneo[] = [];

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController, 
    private navCtrl: NavController
    ) { }

  ngOnInit() {
  }

  //============== Funcion ngOnInit pero de ionic ==============
  async ionViewWillEnter(){
    const loading = await this.loadingController.create();
    await loading.present();
    await this.getEscaneos();
    await loading.dismiss();
  }

  user(){
    return this.localStorageService.getFromLocalStorage('user');
  }

  navigate(destino){
    this.navCtrl.navigateRoot(destino);
  }

  //============== Funcion para obtener array de los escaneos ==============
  async getEscaneos(){
    let path = `users/${this.user().uid}/escaneos`;
    const loading = await this.loadingController.create();
    await loading.present();

    let sub = this.authService.getCollectionData(path).subscribe({
      next: (res: any)=>{
        this.escaneos = res;
        sub.unsubscribe();
      }
    });
    await loading.dismiss();
  }
  //============== Funcion eliminar del storage ==============
  async deleteEscaneo(escaneo: Escaneo){
    let path = `users/${this.user().uid}/escaneos/${escaneo.id}`;
    const loading = await this.loadingController.create();
    await loading.present();
    let imagePath = await this.authService.getFilePath(escaneo.imagen);
    await this.authService.deleteFile(imagePath);
    try{
      this.authService.deleteDocument(path).then(async res=>{

        this.escaneos = this.escaneos.filter( p=> p.id != escaneo.id);
        this.showAlert('Eliminado!', 'Se elimino con exito.');
      });
    }
    catch (error){
      this.showAlert('Ocurrio un error: ', error.message);
    }

    await loading.dismiss();
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
  async showConfirm(escaneo: Escaneo) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Seguro que desea eliminar esta card?',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary'
      },
      {
        text: 'Eliminar',
        cssClass: 'danger',
        handler: ()=>{ this.deleteEscaneo(escaneo) }
      }
    ],
    });
    await alert.present();
  }
}
