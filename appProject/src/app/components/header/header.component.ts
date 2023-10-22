import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
  @Input() page: string = "";
  public userEmail: string;
  public progress = 0;
  constructor(private router: Router, private authService: AuthService, private navCtrl: NavController, private menu: MenuController) { }

  ngOnInit() {
    this.userEmail = this.authService.getUsuario().email;
  }
  async logout(){
    await this.authService.logout();
    this.router.navigateByUrl('/', {replaceUrl: true})
  }
  async navigateTo(destino){
    if(destino != this.page){
      await this.cargando();
    
      this.navCtrl.navigateRoot(destino);
    }
    else{
      this.menu.close('main-menu');
    }
  }

  cargando(){
    setInterval(()=>{
      this.progress += 0.1;
    })
    return new Promise(resolve=>setTimeout(resolve, 500));
  }
}