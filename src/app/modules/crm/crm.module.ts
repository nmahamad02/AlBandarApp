import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './contacts-component/contacts/contacts.component';
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
import { InvoiceComponent } from './invoice-component/invoice/invoice.component';
import { InvoicereportComponent } from './invoice-component/invoicereport/invoicereport.component'; 
import { ActiveReportsModule } from '@grapecity/activereports-angular';
import { CustomerprofileComponent } from './customerprofile-component/customerprofile/customerprofile.component';
import { MembersComponent } from './members-component/members/members.component';
import { MembershipComponent } from './membership/membership.component';
import { ReferenceComponent } from './reference-component/reference/reference.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ReceiptComponent } from './reciept-component/receipt/receipt.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DepartmentComponent } from './department-component/department/department.component';
import { CostcenterComponent } from './costcenter-component/costcenter/costcenter.component';
import { AgreementComponent } from './agreement-component/agreement/agreement.component';
import { AgreementListComponent } from './agreement-component/agreement-list/agreement-list.component';
import { ContactsListComponent } from './contacts-component/contacts-list/contacts-list.component';
import { MembersListComponent } from './members-component/members-list/members-list.component';
import { ReferenceListComponent } from './reference-component/reference-list/reference-list.component';
import { CostcenterListComponent } from './costcenter-component/costcenter-list/costcenter-list.component';
import { DepartmentListComponent } from './department-component/department-list/department-list.component';
import { InvoiceListComponent } from './invoice-component/invoice-list/invoice-list.component';
import { CustomerprofileListComponent } from './customerprofile-component/customerprofile-list/customerprofile-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from "@angular/material/sort";
import { MatTableExporterModule } from 'mat-table-exporter';
import { ReceiptListComponent } from './reciept-component/receipt-list/receipt-list.component';
import { ReceiptAllocationComponent } from './reciept-component/receipt-allocation/receipt-allocation.component';

export const crmRoutes = [
  {
    path: 'contacts',
    component: ContactsListComponent
  },
  {
    path: 'contacts/details/:id',
    component: ContactsComponent
  },
  {
    path: 'invoice',
    component: InvoiceListComponent
  },
  {
    path: 'invoice/details/:id',
    component: InvoiceComponent
  },
  {
    path: 'invoice/report/:id',
    component: InvoicereportComponent
  },
  {
    path: 'customers',
    component: CustomerprofileListComponent
  },
  {
    path: 'customer/details/:id',
    component: CustomerprofileComponent
  },
  {
    path: 'members',
    component: MembersListComponent
  },
  {
    path: 'member/details/:id',
    component: MembersComponent
  },
  {
    path: 'receipt',
    component: ReceiptListComponent
  },
  {
    path: 'receipt/details/:id',
    component: ReceiptComponent
  },
  {
    path: 'receipt/details/:id/allocation',
    component: ReceiptAllocationComponent
  },
  {
    path: 'reference',
    component: ReferenceListComponent
  },
  {
    path: 'reference/details/:id',
    component: ReferenceComponent
  },
  {
    path: 'department',
    component: DepartmentListComponent
  },
  {
    path: 'department/details/:id',
    component: DepartmentComponent
  },
  {
    path: 'costcenter',
    component: CostcenterListComponent
  },
  {
    path: 'costcenter/details/:id',
    component: CostcenterComponent
  },
  {
    path: "agreements",
    component: AgreementListComponent
  },
  {
    path: 'agreements/details/:id',
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
    ReceiptListComponent,
    DepartmentComponent,
    CostcenterComponent,
    AgreementComponent,
    AgreementListComponent,
    ContactsListComponent,
    MembersListComponent,
    ReferenceListComponent,
    CostcenterListComponent,
    DepartmentListComponent,
    InvoiceListComponent,
    CustomerprofileListComponent,
    ReceiptAllocationComponent
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
    PdfViewerModule,
    AgGridModule.withComponents(),
    ReactiveFormsModule,
    ActiveReportsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableExporterModule,
    RouterModule.forChild(crmRoutes)
  ],
  bootstrap: [ContactsComponent]
})
export class CrmModule { }
