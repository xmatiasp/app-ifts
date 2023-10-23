import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {
  redirectUnauthorizedTo,
  redirectLoggedInTo,
  canActivate
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);
const redirectLoggedInToEscaner = () => redirectLoggedInTo(['escaner']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
  ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
  ...canActivate(redirectUnauthorizedToLogin)
  },

  {
    path: 'escaner',
    loadChildren: () => import('./escaner/escaner.module').then( m => m.EscanerPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule),

  },
  {
    path: 'resset-pass',
    loadChildren: () => import('./resset-pass/resset-pass.module').then( m => m.RessetPassPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'escaneos',
    loadChildren: () => import('./escaneos/escaneos.module').then( m => m.EscaneosPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
