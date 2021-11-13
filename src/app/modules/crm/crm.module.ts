import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './contacts/contacts.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
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
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoicereportComponent } from './invoicereport/invoicereport.component'; 
import { ActiveReportsModule } from '@grapecity/activereports-angular';
import { CustomerprofileComponent } from './customerprofile/customerprofile.component';
import { MembersComponent } from './members/members.component';
import { MembershipComponent } from './membership/membership.component';
import { ReferenceComponent } from './reference/reference.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ReceiptComponent } from './receipt/receipt.component';
import { DepartmentComponent } from './department/department.component';
import { CostcenterComponent } from './costcenter/costcenter.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { AgreementComponent } from './agreement/agreement.component';

export const crmRoutes = [
  {
    path: 'contacts',
    component: ContactsComponent
  },
  {
    path: 'invoice',
    component: InvoiceComponent
  },
  {
    path: 'invoicereport',
    component: InvoicereportComponent
  },
  {
    path: 'customers',
    component: CustomerprofileComponent
  },
  {
    path: 'members',
    component: MembersComponent
  },
  {
    path: 'reference',
    component: ReferenceComponent
  },
  {
    path: 'member/details',
    component: MembershipComponent
  },{
    path: 'receipt',
    component: ReceiptComponent
  },{
    path: 'deparment',
    component: DepartmentComponent
  },{
    path: 'costcenter',
    component: CostcenterComponent
  },{
    path: 'sales-order',
    component: SalesOrderComponent
  },{
    path: "agreements",
    component: AgreementComponent
  }
]

@NgModule({
  declarations: [
    ContactsComponent,
    InvoiceComponent,
    InvoicereportComponent,
    CustomerprofileComponent,
    MembersComponent,
    MembershipComponent,
    ReferenceComponent,
    ReceiptComponent,
    DepartmentComponent,
    CostcenterComponent,
    SalesOrderComponent,
    AgreementComponent
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    AgGridModule.withComponents(),
    ReactiveFormsModule,
    ActiveReportsModule,
    RouterModule.forChild(crmRoutes)
  ],
  bootstrap: [ContactsComponent]
})
export class CrmModule { }
