import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GridOptions } from 'ag-grid-community';
import { CrmService } from 'src/app/services/crm/crm.service';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { FinanceService } from 'src/app/services/finance/finance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Console } from 'console';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})

export class InvoiceComponent implements OnInit {
  searchValue: any;
  isTableExpanded = false;
  invoiceForm: FormGroup;
  
  agrDetArr: any[] = [];
  SOArr: any[] = [];
  invArr: any[] = [];

  selectedRowIndex: any = 0;

  docInvNo: any;
  docInv: any;

  mPartyName: string = "";
  mPartyId: string = "";
  mPartyPhone: string = "";
  mPartyAdd1: string = "";
  mPartyAdd2: string = "";
  mPartyAdd3: string = "";
  mAgrNo: string = "";
  mInvTotal = 0;
  mInvVAT = 0;
  mInvDisc = 0;
  mInvGTotal = 0;

  utc = new Date();
  mCurDate = this.formatDate(this.utc);
  mCYear = new Date().getFullYear();

  invReportApiUrl: string = "";
  invReportName: string = "";

  @ViewChild('SOLookUpDialouge') SOLookUpDialouge!: TemplateRef<any>;
  @ViewChild('InvoiceLookUpDialouge') InvoiceLookUpDialouge!: TemplateRef<any>;
  
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;

  SalesOrderDisplayedColumns: string[] = ['sono', 'pcode', 'custname','refno', 'agrno', 'total'];
  SalesOrderDataSource = new MatTableDataSource(this.SOArr);

  InvoiceDisplayedColumns: string[] = ['invno', 'sono', 'date', 'custname','total'];
  InvoiceDataSource = new MatTableDataSource(this.invArr);

  BlaDisplayedColumns: string[] = [ "desc", "name", "fromdate", "todate", "amount"];
  BlaListDataSource = new MatTableDataSource(this.agrDetArr);

  constructor(private crmservice: CrmService,private dialog: MatDialog,private financeService: FinanceService,private lookupservice:LookupService,private dataSharing: DataSharingService, private route: ActivatedRoute, private router: Router) {
    this.invoiceForm = new FormGroup({
      invNo: new FormControl('', [ Validators.required]),
      soNo: new FormControl('', [ Validators.required]),
      agrNo: new FormControl('', [ Validators.required]),
      invDate: new FormControl('', [ Validators.required]),
      subject: new FormControl('', [ Validators.required]),
      total: new FormControl('', [ Validators.required]),
      gtotal: new FormControl('', [ Validators.required]),
      discount: new FormControl('', [ Validators.required]),
      vat: new FormControl('', [ Validators.required]),
      custname: new FormControl('', [ Validators.required]),
      pCode: new FormControl('', [ Validators.required]),
      add1: new FormControl('', [ Validators.required]),
      add2: new FormControl('', [ Validators.required]),
      add3: new FormControl('', [ Validators.required]),
      phoneNo: new FormControl('', [ Validators.required]),
      remarks: new FormControl('', [ Validators.required]),
    });
  } 

  refreshForm() {
    this.invArr = [];
    this.mInvTotal = 0;
    this.mInvVAT = 0;
    this.mInvDisc = 0;
    this.mInvGTotal = 0;
    this.mAgrNo = "";
    this.mPartyName = "";
    this.mPartyPhone = "";
    this.mPartyId = "";
    this.mPartyAdd1 = "";
    this.mPartyAdd2 = "";
    this.mPartyAdd3 = "";
    this.invoiceForm = new FormGroup({
      invNo: new FormControl('', [ Validators.required]),
      soNo: new FormControl('', [ Validators.required]),
      agrNo: new FormControl('', [ Validators.required]),
      invDate: new FormControl('', [ Validators.required]),
      total: new FormControl('', [ Validators.required]),
      gtotal: new FormControl('', [ Validators.required]),
      vat: new FormControl('', [ Validators.required]),
      custname: new FormControl('', [ Validators.required]),
      discount: new FormControl('', [ Validators.required]),
      pCode: new FormControl('', [ Validators.required]),
      add1: new FormControl('', [ Validators.required]),
      add2: new FormControl('', [ Validators.required]),
      add3: new FormControl('', [ Validators.required]),
      phoneNo: new FormControl('', [ Validators.required]),
      remarks: new FormControl('', [ Validators.required]),
      subject: new FormControl('', [ Validators.required]),
    });
  }

  lookupSalesorder(value: string) {
    this.selectedRowIndex = 0;
    let dialogRef = this.dialog.open(this.SOLookUpDialouge);    
    this.financeService.searchSalesOrderMaster(value).subscribe((res: any) => {
      console.log(this.SOArr);
      this.SOArr = res.recordset;
      this.SalesOrderDataSource = new MatTableDataSource(this.SOArr);
    }, (err: any) => {
    })
  }

  getSalesorder(sono: any) {
      this.financeService.getSalesOrderMaster(sono).subscribe((res: any) => {
        console.log(res.recordset[0])
        this.getInvoiceFromSalesOrder(res.recordset[0]);
      }, (err: any) => {
        
    })
  }

  getInvoiceFromSalesOrder(salesOrder: any) {
    let dialogRef = this.dialog.closeAll();
    this.financeService.getSales(salesOrder.REFNO).subscribe((res: any) => {
      this.selectInvoice(res.recordset[0]);
    }, (err: any) => {
      const date = this.formatDate(salesOrder.SODATE);
      this.mAgrNo = salesOrder.QUOTNO;
      this.mPartyName = salesOrder.CUST_NAME;
      this.mPartyId = salesOrder.PCODE;
      this.mPartyPhone = salesOrder.CUST_PHONE1;
      this.mPartyAdd1 = salesOrder.CUST_ADD1;
      this.mPartyAdd2 = salesOrder.CUST_ADD2;
      this.mPartyAdd3 = salesOrder.CUST_ADD3;
      this.mInvTotal = salesOrder.TOTAL;
      this.mInvVAT = salesOrder.VATAMT;
      this.mInvDisc = salesOrder.DISCOUNT;
      this.mInvGTotal = salesOrder.GTOTAL;
      this.invoiceForm.patchValue({
        soNo: salesOrder.SONO,
        agrNo: salesOrder.QUOTNO,
        invDate: date,
        total: salesOrder.AMOUNT,
        gtotal: salesOrder.GROSSAMOUNT,
        discount: salesOrder.DISCOUNT,
        vat: salesOrder.TAX_1_AMT,
        custname: salesOrder.CUST_NAME,
        pCode: salesOrder.PCODE,
        add1: salesOrder.CUST_ADD1,
        add2: salesOrder.CUST_ADD2,
        add3: salesOrder.CUST_ADD3,
        phoneNo: salesOrder.CUST_PHONE1,
        remarks: salesOrder.REMARKS,
        subject: salesOrder.SUBJECT
      });
      this.crmservice.getagreementDetails(this.mAgrNo).subscribe((res: any) => {
        this.agrDetArr = res.recordset;
        console.log(this.agrDetArr);
        for(let i=0; i<res.recordset.length; i++) {
          this.agrDetArr[i].FROMDT = this.formatDate(this.agrDetArr[i].FROMDT);
          this.agrDetArr[i].TODT = this.formatDate(this.agrDetArr[i].TODT);          
          this.crmservice.getAgreementBLA(this.mAgrNo, res.recordset[i].MEMBERCODE).subscribe((resp: any) => {
            const blA = resp.recordset;
            this.agrDetArr[i].blAArr = blA;
          })
        }
        this.BlaListDataSource = new MatTableDataSource(this.agrDetArr);
        this.BlaListDataSource.sort = this.sort;
        this.BlaListDataSource.paginator = this.paginator;
        console.log(this.agrDetArr);
        this.toggleTableRows();
      })
    })
  }

  getInvoice(invno: any) {
    this.financeService.getSales(invno).subscribe((res: any) => {
      console.log(res.recordset[0])
      this.selectInvoice(res.recordset[0]);
    }, (err: any) => {
      
  })
  }

  lookupInvoice(value: string) {
    this.selectedRowIndex = 0;
    let dialogRef = this.dialog.open(this.InvoiceLookUpDialouge);    
    this.financeService.searchSales(value).subscribe((res: any) => {
      console.log(this.invArr)
      this.invArr = res.recordset;
      this.InvoiceDataSource = new MatTableDataSource(this.invArr);
    }, (err: any) => {
    })
  }

  selectInvoice(invoice: any) {
    let dialogRef = this.dialog.closeAll();
    const date = this.formatDate(invoice.TRN_DATE);
    this.financeService.getSalesOrderMaster(invoice.REF_NO).subscribe((res: any) => {
      console.log(res.recordset[0]);
      this.mAgrNo = res.recordset[0].QUOTNO;
      this.mPartyName = invoice.CUST_NAME;
      this.mPartyId = res.recordset[0].PCODE;
      this.mPartyPhone = res.recordset[0].CUST_PHONE1;
      this.mPartyAdd1 = res.recordset[0].CUST_ADD1;
      this.mPartyAdd2 = res.recordset[0].CUST_ADD2;
      this.mPartyAdd3 = res.recordset[0].CUST_ADD3;
      this.mInvTotal = invoice.AMOUNT;
      this.mInvVAT = invoice.TAX_1_AMT;
      this.mInvDisc = invoice.DISCOUNT;
      this.mInvGTotal = invoice.GROSSAMOUNT;
      this.invoiceForm.patchValue({
        invNo: invoice.TRN_NO,
        soNo: invoice.REF_NO,
        agrNo: res.recordset[0].QUOTNO,
        invDate: date,
        total: invoice.AMOUNT,
        gtotal: invoice.GROSSAMOUNT,
        discount: invoice.DISCOUNT,
        vat: invoice.TAX_1_AMT,
        custname: invoice.CUST_NAME,
        pCode: res.recordset[0].PCODE,
        add1: res.recordset[0].CUST_ADD1,
        add2: res.recordset[0].CUST_ADD2,
        add3: res.recordset[0].CUST_ADD3,
        phoneNo: res.recordset[0].CUST_PHONE1,
        remarks: invoice.REMARKS,
        subject: invoice.SUBJECT
      })
      this.crmservice.getagreementDetails(this.mAgrNo).subscribe((res: any) => {
        this.agrDetArr = res.recordset;
        console.log(this.agrDetArr)
        for(let i=0; i<res.recordset.length; i++) {
          this.agrDetArr[i].FROMDT = this.formatDate(this.agrDetArr[i].FROMDT);
          this.agrDetArr[i].TODT = this.formatDate(this.agrDetArr[i].TODT);          
          this.crmservice.getAgreementBLA(this.mAgrNo, res.recordset[i].MEMBERCODE).subscribe((resp: any) => {
            const blA = resp.recordset;
            this.agrDetArr[i].blAArr = blA;
          })
        }
        this.BlaListDataSource = new MatTableDataSource(this.agrDetArr);
        this.BlaListDataSource.sort = this.sort;
        this.BlaListDataSource.paginator = this.paginator;
        console.log(this.agrDetArr);
        this.toggleTableRows();
      })
    }, (err: any) => {
      
    })
  }
  
  ngOnInit(): void {
    this.getInvoice(this.route.snapshot.params.id);
  }

  onFormSubmit() {
    const invData = this.invoiceForm.value;
    const year = String(this.mCYear);
    console.log(invData);
    this.financeService.getSales(invData.invNo).subscribe((res: any) => {
      this.financeService.updateSales(year,invData.invNbr,invData.sodate,invData.pCode,invData.pCode, invData.custname, String(this.mInvGTotal), String(this.mInvDisc), String(this.mInvVAT), String(this.mInvTotal), invData.soNo, invData.subject, invData.remarks, 'DBA', this.mCurDate).subscribe((resp: any) => {
        console.log(resp);
        this.financeService.updateOutstanding(year, invData.invNbr, invData.sodate, invData.pCode,'INV', String(this.mInvGTotal), invData.subject, invData.remarks).subscribe((respo: any) => {
          console.log(respo)
        })
      })
    }, (err: any) => {
      this.financeService.getDocForInv(year).subscribe((resp: any) => {
        const yearStr = String(resp.recordset[0].CYEAR).substring(2);
        this.docInvNo = resp.recordset[0].FIELD_VALUE_NM + 1;
        this.docInv = 'INV' + yearStr + '-' + this.docInvNo.toString();
        this.financeService.postSales(year,this.docInv,this.mCurDate,invData.pCode,invData.pCode, invData.custname, String(this.mInvGTotal), String(this.mInvDisc), String(this.mInvVAT), String(this.mInvTotal), invData.soNo, invData.subject, invData.remarks, 'DBA', this.mCurDate).subscribe((resp: any) => {
          this.financeService.postOutstanding(year, this.docInv, this.mCurDate, invData.pCode, 'INV', String(this.mInvGTotal), invData.subject, invData.remarks).subscribe((respo: any) => {
            console.log(respo);
            this.refreshForm();
            this.financeService.updateDocForInv(this.docInvNo, String(this.mCYear)).subscribe((res: any) => {
              this.financeService.setInvoice(invData.agrNo, invData.soNo, this.docInv).subscribe((respos: any) => {
                this.getSalesorder(invData.soNo);
              })
            }, (err: any) => {
              console.log(err);
            });
          })
        });
      }, (error: any) => {
        console.log(error);
      })
    });
  }
  
  arrowDownEvent(type: string, index: number){
    this.highlight(type, ++index);
  }

  arrowUpEvent(type: string, index: number){
    this.highlight(type, --index);
  }
  
  setReportData(apiUrl: string, reportType: string){
    const reportData = {
      apiUrl: apiUrl,
      reportType: reportType
    };
    this.dataSharing.setData(reportData);
  }
  
  highlight(type: string, index: number){
    if (type === "salesorder") {
      if(index >= 0 && index <= this.SOArr.length - 1){
        this.selectedRowIndex = index;
      } 
    } else if (type === "invoice") {
      if(index >= 0 && index <= this.invArr.length - 1){
        this.selectedRowIndex = index;
      } 
    }
  }

  formatDate(date: any) {
    var d = new Date(date), day = '' + d.getDate(), month = '' + (d.getMonth() + 1), year = d.getFullYear();

    if (day.length < 2) {
      day = '0' + day;
    } 
    if (month.length < 2) {
      month = '0' + month;
    }
    return [day, month, year].join('-');
  }

  public goToSalesOrder() {
    const soData = this.invoiceForm.value;
    var id = soData.agrNbr;
    var myurl = `/crm/sales-order/details/${id}`;
    this.router.navigateByUrl(myurl).then(e => {
    });
  }

  toggleTableRows() {
    this.isTableExpanded = !this.isTableExpanded;
    this.BlaListDataSource.data.forEach((row: any) => {
      row.isExpanded = this.isTableExpanded;
    })
  }

}