import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GridOptions } from 'ag-grid-community';
import { Console } from 'console';
import { CrmService } from 'src/app/services/crm/crm.service';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';
import { FinanceService } from 'src/app/services/finance/finance.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';

@Component({
  selector: 'sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.scss']
})

export class SalesOrderComponent implements OnInit {
  constructor(private crmservice: CrmService,private dialog: MatDialog,private financeService: FinanceService,private lookupservice:LookupService,private dataSharing: DataSharingService ) {
   /* this.salesOrderForm = new FormGroup({
      voucherNo: new FormControl('', [ Validators.required]),
      voucherDate: new FormControl('', [ Validators.required]),
      quotationNo: new FormControl('', [ Validators.required]),
      purchaseOrderNo: new FormControl('', [ Validators.required]),
      party: new FormControl('', [ Validators.required]),
      customerCode: new FormControl('', [ Validators.required]),
      total: new FormControl('', [ Validators.required]),
      gtotal: new FormControl('', [ Validators.required]),
      discount: new FormControl('', [ Validators.required]),
      name: new FormControl('', [ Validators.required]),
      add1: new FormControl('', [ Validators.required]),
      add2: new FormControl('', [ Validators.required]),
      add3: new FormControl('', [ Validators.required]),
      phoneNo: new FormControl('', [ Validators.required]),
      emailAddress: new FormControl('', [ Validators.required]),
      telephone: new FormControl('', [ Validators.required]),
      subject: new FormControl('', [ Validators.required]),
      srvItemArr: new FormArray([])
    });*/
  } 

  
  ngOnInit(): void {
  }
}
