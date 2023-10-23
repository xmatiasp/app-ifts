import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscaneosPage } from './escaneos.page';

const routes: Routes = [
  {
    path: '',
    component: EscaneosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscaneosPageRoutingModule {}
