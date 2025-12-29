import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { ClaimsDashboardComponent } from './components/claims/claims-dashboard/claims-dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'claims',
    component: ClaimsDashboardComponent,
    canActivate: [authGuard]   // 🔐 THIS WAS MISSING
  },
];
