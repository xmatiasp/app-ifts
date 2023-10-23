import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
  @Input() page: string = "";
  public username: string;
  public progress = 0;
  constructor(private router: Router, 
    private authService: AuthService, 
    private navCtrl: NavController, 
    private menu: MenuController,
    private localStorageService: LocalStorageService
    ) { }

  ngOnInit() {
    this.asignarUsername();
  }
  async logout(){
    await this.authService.logout();
    this.localStorageService.removeFromLocalStorage('user');
    this.router.navigateByUrl('/', {replaceUrl: true})
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
  /* ========== Funcion para navegar a pagina sin header ========== */
  async navigate(destino){
    await this.cargando();
    this.menu.close('main-menu');
    this.router.navigate([destino]);
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
  asignarUsername(){
    const name = this.authService.getUsuario().displayName;
    name?this.username = name:this.username=this.authService.getUsuario().email;
  }
}