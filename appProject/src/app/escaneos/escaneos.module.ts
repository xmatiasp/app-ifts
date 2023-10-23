import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscaneosPageRoutingModule } from './escaneos-routing.module';

import { EscaneosPage } from './escaneos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscaneosPageRoutingModule
  ],
  declarations: [EscaneosPage]
})
export class EscaneosPageModule {}
