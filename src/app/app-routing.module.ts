import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrmModule } from './modules/crm/crm.module';

const routes: Routes = [
  {
    path: 'crm',
    loadChildren: () => import('./modules/crm/crm.module').then(m => m.CrmModule)
  },
  {
    path: 'club',
    loadChildren: () => import('./modules/club-services/club-services.module').then(m => m.ClubServicesModule)
  },
  {
    path: 'mis',
    loadChildren: () => import('./modules/management/management.module').then(m => m.ManagementModule)
  },
  { 
    path: '**', //If path doesn't match anything reroute to /authentication/signin
    redirectTo: '/home/dashboard', 
    pathMatch: 'full' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
