import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  usuario: string = "";

  constructor(
    private navCtrl: NavController
  ) {}

  ngOnInit(){

  }

  navigateEscaner(){
    this.navCtrl.navigateRoot('escaner');
  }

}
