import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesComponent } from './services/services.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule} from '@angular/material/card'
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AgGridModule } from 'ag-grid-angular';
import { TaxcatergoryComponent } from './taxcatergory/taxcatergory.component';
import { BoatComponent } from './boat/boat.component';

export const clubRoutes = [
  {
    path: 'services',
    component: ServicesComponent
  },
  {
    path: 'tax-category',
    component: TaxcatergoryComponent
  },
  {
    path: 'boat',
    component: BoatComponent
  }
]


@NgModule({
  declarations: [
    ServicesComponent,
    TaxcatergoryComponent,
    BoatComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    AgGridModule.withComponents(),
    //ActiveReportsModule,
    RouterModule.forChild(clubRoutes)
    

  ]
})
export class ClubServicesModule { }
