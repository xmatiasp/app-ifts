import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RessetPassPage } from './resset-pass.page';

const routes: Routes = [
  {
    path: '',
    component: RessetPassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RessetPassPageRoutingModule {}
