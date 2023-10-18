import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RessetPassPageRoutingModule } from './resset-pass-routing.module';

import { RessetPassPage } from './resset-pass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RessetPassPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RessetPassPage]
})
export class RessetPassPageModule {}
