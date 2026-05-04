import { Routes } from '@angular/router';
import { Register } from './views/auth/register/register';
import { Login } from './views/auth/login/login';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { Home } from './views/home/home';
import { ProfileEditor } from './views/profile-editor/profile-editor';

export const routes: Routes = [
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'profile-editor', component: ProfileEditor, canActivate: [authGuard] },
  { path: '', component: Home, canActivate: [authGuard], pathMatch: 'full' },
];
