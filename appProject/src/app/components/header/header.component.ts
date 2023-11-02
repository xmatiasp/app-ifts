import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
  @Input() page: string = "";
  public cantidadTextos: number= 0;
  public user: any;
  public username: string="";
  public progress = 0;
  constructor(private router: Router, 
    private authService: AuthService, 
    private navCtrl: NavController, 
    private menu: MenuController,
    private localStorageService: LocalStorageService,
    private loadingController: LoadingController,
    private alertController: AlertController
    ) {}

  ngOnInit() {
    this.getUser();
  }
  //============== Boton cerrar sesion ==============
  async logout(){
    await this.authService.logout();
    this.localStorageService.removeFromLocalStorage('user');
    this.menu.close('main-menu');
    this.router.navigateByUrl('/', {replaceUrl: true})
  }
  //============== Funcion para obtener datos del localStorage ==============
  async getUser(){
    try{
      this.user = await this.localStorageService.getFromLocalStorage('user');
      if(this.user){
        this.getEscaneos();
        this.asignarUsername();
      }
      else{
        throw new Error();
      }
    }
    catch(error){
      this.showAlert("Usuario no logeado","Por favor vuelva a iniciar sesion");
    }
    
  }
  //============== Funcion para obtener cantidad de escaneos del user ==============
  async getEscaneos(){
    try{
      let path = `users/${this.user.uid}/escaneos`;
      this.authService.getCollectionData(path).subscribe({
      next: (res: any)=>{
        this.cantidadTextos = res.length;
      }
    });
    }
    catch (error){
      throw new Error(error.message);
    }
    
  }

  /* ========== Funcion para navegar a pagina con mismo header ========== */
  async navigateTo(destino){
    if(destino != this.page){
      await this.cargando();
      this.navCtrl.navigateRoot(destino);
    }
    else{
      this.menu.close('main-menu');
    }
  }
  /* ========== Funcion para simular una carga de pagina ========== */
  async cargando() {
    const interval = 100;
    const totalSteps = 10;
    let currentStep = 0;
  
    return new Promise((resolve) => {
      const updateProgress = () => {
        currentStep++;
        this.progress = currentStep / totalSteps;
  
        if (this.progress < 1) {
          setTimeout(updateProgress, interval);
        } else {
          resolve(null);
          this.progress = 0;
        }
      };
  
      updateProgress();
    });
  }

  /* ========== Funcion para setear el username ========== */
  async asignarUsername(){
    this.username = this.user.name;
  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text: 'OK',
        cssClass: 'danger',
        handler: () => this.logout()
    }],
    });
    await alert.present();
  }
}