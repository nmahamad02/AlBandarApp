import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersComponent } from './members/members.component';
import { RevenuesComponent } from './revenues/revenues.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card'


export const misRoutes = [
  {
    path: 'members',
    component: MembersComponent
  },
  {
    path: 'revenues',
    component: RevenuesComponent
  }
];

@NgModule({
  declarations: [
    MembersComponent,
    RevenuesComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule.forChild(misRoutes)
  ]
})
export class ManagementModule { }
