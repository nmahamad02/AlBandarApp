import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
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
  salesOrderForm: FormGroup;
  
  SOArr: any[] = [];
  agrArr: any[] = [];
  invArr: any[] = [];

  selectedRowIndex: any = 0;
  membArr: any[] = [];
  partyArr: any[] = [];
  srvArr: any[] = [];
  refArr: any[] = [];
  memberList: any;

  refIndex:number  = 0;
  srvIndex:number = 0;
  argIndex: number = 0;
  serviceIndex: number = 0;
  memberIndex: number = 0;
  valueIndex: number = 0;

  docArgNo: any;
  docArg: any;
  docSONo: any;
  docSO: any;
  docInvNo: any;
  docInv: any;
  taxArr: any;
  discount: number;
  grossvalue: number;
  price:number = 0;

  mPartyName: string = "";
  mPartyId: string = "";
  mPartyPhone: string = "";
  mPartyAdd1: string = "";
  mPartyAdd2: string = "";
  mPartyAdd3: string = "";
  mAgrTotal = 0;
  mAgrVAT = 0;
  mAgrDisc = 0;
  mAgrGTotal = 0;

  utc = new Date();
  mCurDate = this.formatDate(this.utc);
  mCYear = new Date().getFullYear();

  invReportApiUrl: string = "";
  invReportName: string = "";

  @ViewChild('SOLookUpDialouge') SOLookUpDialouge!: TemplateRef<any>;
  @ViewChild('AgreementLookUpDialouge') AgreementLookUpDialouge!: TemplateRef<any>;
  @ViewChild('InvoiceLookUpDialouge') InvoiceLookUpDialouge!: TemplateRef<any>;

  SalesOrderDisplayedColumns: string[] = ['sono', 'pcode', 'custname','total'];
  SalesOrderDataSource = new MatTableDataSource(this.SOArr);

  AgreementDisplayedColumns: string[] = ['agrno', 'sono', 'pcode', 'custname','total'];
  AgreementDataSource = new MatTableDataSource(this.agrArr);

  InvoiceDisplayedColumns: string[] = ['invno', 'sono', 'date', 'custname','total'];
  InvoiceDataSource = new MatTableDataSource(this.invArr);

  constructor(private crmservice: CrmService,private dialog: MatDialog,private financeService: FinanceService,private lookupservice:LookupService,private dataSharing: DataSharingService, private route: ActivatedRoute, private router: Router) {
    this.salesOrderForm = new FormGroup({
      agrNbr: new FormControl('', [ Validators.required]),
      soNbr: new FormControl('', [ Validators.required]),
      invNbr: new FormControl('', [ Validators.required]),
      sodate: new FormControl('', [ Validators.required]),
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
      remarks: new FormControl('', [ Validators.required]),
      srvItemArr: new FormArray([])
    });
  } 

  refreshForm() {
    this.agrArr = [];
    this.mAgrTotal = 0;
    this.mAgrVAT = 0;
    this.mAgrDisc = 0;
    this.mAgrGTotal = 0;
    this.mPartyName = "";
    this.mPartyPhone = "";
    this.mPartyId = "";
    this.mPartyAdd1 = "";
    this.mPartyAdd2 = "";
    this.mPartyAdd3 = "";
    this.salesOrderForm = new FormGroup({
      agrNbr: new FormControl('', [ Validators.required]),
      soNbr: new FormControl('', [ Validators.required]),
      sodate: new FormControl('', [ Validators.required]),
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
      remarks: new FormControl('', [ Validators.required]),
      srvItemArr: new FormArray([])
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
        this.selectSalesOrder(res.recordset[0]);
      }, (err: any) => {
        
    })
  }

  getSalesorderFromAgreement(salesOrder: any) {
    this.financeService.getSalesOrderMaster(salesOrder.SONO).subscribe((res: any) => {
      this.selectSalesOrder(res.recordset[0]);
    }, (err: any) => {
      const date = this.formatDate(salesOrder.AGR_DATE);
      this.salesOrderForm.patchValue({
        agrNbr: salesOrder.AGR_NO,
        soNbr: salesOrder.SONO,
        invNbr: salesOrder.REFNO,
        sodate: date,
        party: salesOrder.PARTY_ID,
        customerCode: salesOrder.PCODE,
        total: salesOrder.TOTAL,
        gtotal: salesOrder.GTOTAL,
        discount: salesOrder.DISCOUNT,
        name: salesOrder.CUST_NAME,
        add1: salesOrder.CUST_ADD1,
        add2: salesOrder.CUST_ADD2,
        add3: salesOrder.CUST_ADD3,
        phoneNo: salesOrder.CUST_PHONE1,
        subject: salesOrder.SUBJECT,
        remarks: "Convert this agreement to Sales order",
      })
      this.mPartyId = salesOrder.PARTY_ID;
      this.mPartyAdd1 = salesOrder.CUST_ADD1;
      this.mPartyAdd2 = salesOrder.CUST_ADD2;
      this.mPartyAdd3 = salesOrder.CUST_ADD3;
      this.mPartyName =  salesOrder.CUST_NAME
      this.mPartyPhone = salesOrder.CUST_PHONE1;
      this.financeService.getAggrementDetails(salesOrder.AGR_NO).subscribe((res: any) => {
        const itemArr = res.recordset;
        for(let x=0; x<itemArr.length; x++) {
          const salesorderGrid = new FormGroup({
            srvCode: new FormControl(itemArr[x].ITCODE, [ Validators.required]),
            srvDesc: new FormControl(itemArr[x].DESCRIPTION, [ Validators.required]),
            srvValue: new FormControl(itemArr[x].VALUE1, [ Validators.required]),
            srvDisc: new FormControl(itemArr[x].DISPER, [ Validators.required]),
            srvDiscount: new FormControl(itemArr[x].DISAMT, [ Validators.required]),
            srvGross: new FormControl(itemArr[x].PRICE, [ Validators.required]),
            srvVatCat: new FormControl(itemArr[x].VATCATEORY, [ Validators.required]),
            srvVat: new FormControl(itemArr[x].VAT, [ Validators.required]),
            srvNetValue: new FormControl(itemArr[x].AMOUNT, [ Validators.required]),
          });
          this.srvItem.push(salesorderGrid);
        }
        this.caliberateTotal();
      }, (error: any) => {
      })
    })
  }

  lookupInvoice(value: string) {
    this.selectedRowIndex = 0;
    let dialogRef = this.dialog.open(this.InvoiceLookUpDialouge);    
    this.financeService.searchSales(value).subscribe((res: any) => {
      this.invArr = res.recordset;
      this.InvoiceDataSource = new MatTableDataSource(this.invArr);
    }, (err: any) => {
    })
  }

  getInvoice(invno: any) {
      this.financeService.getSales(invno).subscribe((res: any) => {
        this.selectSalesOrder(res.recordset[0]);
      }, (err: any) => {
        
    })
  }

  selectInvoice(inv: any){
    this.getSalesorder(inv.SONO);
  }

  convertToInvoice() {
    const soData = this.salesOrderForm.value;
    const year = String(this.mCYear);
    this.financeService.getSales(soData.invNo).subscribe((res: any) => {
      this.financeService.updateSales(year,soData.invNbr,soData.sodate,soData.party,soData.customerCode, soData.name, String(this.mAgrGTotal), String(this.mAgrDisc), String(this.mAgrVAT), String(this.mAgrTotal), soData.soNbr, soData.subject, soData.remarks, 'DBA', this.mCurDate).subscribe((resp: any) => {
        console.log(resp);
        this.financeService.updateOutstanding(year, soData.invNbr, soData.sodate, soData.customerCode, 'INV', String(this.mAgrGTotal), soData.subject, soData.remarks).subscribe((respo: any) => {
          console.log(respo)
        })
      })
    }, (err: any) => {
      this.financeService.getDocForInv(year).subscribe((resp: any) => {
        const yearStr = String(resp.recordset[0].CYEAR).substring(2);
        this.docInvNo = resp.recordset[0].FIELD_VALUE_NM + 1;
        this.docInv = 'INV' + yearStr + '-' + this.docInvNo.toString();
        this.financeService.postSales(year,this.docInv,this.mCurDate,soData.party,soData.customerCode, soData.name, String(this.mAgrGTotal), String(this.mAgrDisc), String(this.mAgrVAT), String(this.mAgrTotal), soData.soNbr, soData.subject, soData.remarks, 'DBA', this.mCurDate).subscribe((resp: any) => {
          this.financeService.postOutstanding(year, this.docInv, this.mCurDate, soData.customerCode, 'INV', String(this.mAgrGTotal), soData.subject, soData.remarks).subscribe((respo: any) => {
            console.log(respo);
            this.refreshForm();
            this.financeService.updateDocForInv(this.docInvNo, String(this.mCYear)).subscribe((res: any) => {
              this.financeService.setInvoice(soData.agrNbr, soData.soNbr, this.docInv).subscribe((respos: any) => {
                this.getSalesorder(soData.soNbr);
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

  lookupAgreement(value: string) {
    this.selectedRowIndex = 0;
    let dialogRef = this.dialog.open(this.AgreementLookUpDialouge);    
    this.crmservice.searchagreementmaster(value).subscribe((res: any) => {
      console.log(this.agrArr)
      this.agrArr = res.recordset;
      this.AgreementDataSource = new MatTableDataSource(this.agrArr);
    }, (err: any) => {
    })
  }

  getAgreement(argno: any) {
      this.crmservice.getagreementmaster(argno).subscribe((res: any) => {
        this.selectAgreement(res.recordset[0]);
      }, (err: any) => {
    })
  }

  selectAgreement(agreement: any) {
    this.getSalesorderFromAgreement(agreement);
    let dialogRef = this.dialog.closeAll();
  }

  selectSalesOrder(salesOrder: any) {
    let dialogRef = this.dialog.closeAll();
    const date = this.formatDate(salesOrder.SODATE);
    this.salesOrderForm.patchValue({
      agrNbr: salesOrder.QUOTNO,
      soNbr: salesOrder.SONO,
      invNbr: salesOrder.REFNO,
      sodate: date,
      party: salesOrder.PARTY_ID,
      customerCode: salesOrder.PCODE,
      total: salesOrder.TOTAL,
      gtotal: salesOrder.GTOTAL,
      discount: salesOrder.DISCOUNT,
      name: salesOrder.CUST_NAME,
      add1: salesOrder.CUST_ADD1,
      add2: salesOrder.CUST_ADD2,
      add3: salesOrder.CUST_ADD3,
      phoneNo: salesOrder.CUST_PHONE1,
      subject: salesOrder.SUBJECT,
      remarks: salesOrder.REMARKS,
    });
    this.mPartyId = salesOrder.PARTY_ID;
    this.mPartyAdd1 = salesOrder.CUST_ADD1;
    this.mPartyAdd2 = salesOrder.CUST_ADD2;
    this.mPartyAdd3 = salesOrder.CUST_ADD3;
    this.mPartyName =  salesOrder.CUST_NAME
    this.mPartyPhone = salesOrder.CUST_PHONE1;
    this.financeService.getSalesOrderDetails(salesOrder.SONO).subscribe((res: any) => {
      const itemArr = res.recordset;
      for(let x=0; x<itemArr.length; x++) {
        const salesorderGrid = new FormGroup({
          srvCode: new FormControl(itemArr[x].ITCODE, [ Validators.required]),
          srvDesc: new FormControl(itemArr[x].DESCRIPTION, [ Validators.required]),
          srvValue: new FormControl(itemArr[x].VALUE1, [ Validators.required]),
          srvDisc: new FormControl(itemArr[x].DISPER, [ Validators.required]),
          srvDiscount: new FormControl(itemArr[x].DISAMT, [ Validators.required]),
          srvGross: new FormControl(itemArr[x].PRICE, [ Validators.required]),
          srvVatCat: new FormControl(itemArr[x].TAX_CATEGORY_ID, [ Validators.required]),
          srvVat: new FormControl(itemArr[x].TAX_1_AMT, [ Validators.required]),
          srvNetValue: new FormControl(itemArr[x].AMOUNT, [ Validators.required]),
        });
        this.srvItem.push(salesorderGrid);
      }
      this.caliberateTotal();
    }, (error: any) => {
    })
  }
  
  ngOnInit(): void {
    this.getSalesorder(this.route.snapshot.params.id);
  }

  onFormSubmit() {
    const agrData = this.salesOrderForm.value;
    console.log(String(this.mAgrTotal));
    console.log(String(this.mAgrDisc));
    console.log(String(this.mAgrGTotal));
    console.log(String(this.mAgrVAT));
    this.financeService.getSalesOrderMaster(agrData.soNbr).subscribe((res: any) => {
      this.financeService.updateSOMaster(agrData.agrNbr, agrData.sodate, agrData.soNbr, agrData.party, agrData.customerCode, agrData.name, String(this.mAgrTotal), String(this.mAgrDisc), String(this.mAgrGTotal), 
        String(this.mAgrVAT), agrData.add1, agrData.add2, agrData.phoneNo, 
        agrData.subject, this.mCurDate, 'DBA').subscribe((resp: any) => {
        this.financeService.deleteSalesOrderDetails(agrData.soNbr).subscribe((response: any) => {
          for(let i=0; i<agrData.srvItemArr.length; i++) {
            this.financeService.postSalesOrderDetails(agrData.soNbr, agrData.srvItemArr[i].srvCode, agrData.srvItemArr[i].srvDesc, agrData.srvItemArr[i].srvValue,agrData.srvItemArr[i].srvGross,agrData.srvItemArr[i].srvDisc,agrData.srvItemArr[i].srvDiscount,agrData.srvItemArr[i].srvVatCat,agrData.srvItemArr[i].srvVat,agrData.srvItemArr[i].srvNetValue,this.mCurDate,'DBA').subscribe((respo: any) => {
            });
          }
        }, (error: any) => {
        })
      })
    }, (err: any) => {
      const year = String(this.mCYear);
      this.financeService.getDocForSO(year).subscribe((resp: any) => {
        const yearStr = String(resp.recordset[0].CYEAR).substring(2);
        this.docSONo = resp.recordset[0].FIELD_VALUE_NM + 1;
        this.docSO = 'SO' + yearStr + '-' + this.docSONo.toString();
        this.financeService.postSalesOrderMaster(agrData.agrNbr,this.mCurDate,this.docSO,agrData.party,agrData.customerCode,agrData.name, String(this.mAgrTotal),String(this.mAgrDisc),String(this.mAgrGTotal), String(this.mAgrVAT),agrData.add1,agrData.phoneNo,agrData.telephone,agrData.subject,this.mCurDate,'DBA').subscribe((resp: any) => {
          for(let i=0; i<agrData.srvItemArr.length; i++) {
            this.financeService.postSalesOrderDetails(this.docSO, agrData.srvItemArr[i].srvCode, agrData.srvItemArr[i].srvDesc, agrData.srvItemArr[i].srvValue,agrData.srvItemArr[i].srvGross,agrData.srvItemArr[i].srvDisc,agrData.srvItemArr[i].srvDiscount,agrData.srvItemArr[i].srvVatCat,agrData.srvItemArr[i].srvVat,agrData.srvItemArr[i].srvNetValue,this.mCurDate,'DBA').subscribe((response: any) => {
            });
          }
        });
        this.financeService.updatedocso(this.docSONo, String(this.mCYear)).subscribe((res: any) => {
          this.financeService.setSalesOrder(agrData.agrNbr, this.docSO).subscribe((respos: any) => {
            this.getSalesorder(this.docSO);
          })
        }, (err: any) => {
          console.log(err);
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

  deleteServiceItem(index: number) {
    if(this.srvItem.length === 1){
    } else {
      this.srvItem.removeAt(index);
    }
  }

  addServiceItem() {
    const ServiceGrid = new FormGroup({
      srvCode: new FormControl('', [ Validators.required]),
      srvDesc: new FormControl('', [ Validators.required]),
      srvValue: new FormControl('', [ Validators.required]),
      srvDisc: new FormControl('', [ Validators.required]),
      srvDiscount: new FormControl('', [ Validators.required]),
      srvGross: new FormControl('', [ Validators.required]),
      srvVatCat: new FormControl('', [ Validators.required]),
      srvVat: new FormControl('', [ Validators.required]),
      srvNetValue: new FormControl('', [ Validators.required]),
    });
    this.srvItem.push(ServiceGrid);
  }
  
  highlight(type: string, index: number){
    if (type === "salesorder") {
      if(index >= 0 && index <= this.SOArr.length - 1){
        this.selectedRowIndex = index;
      } 
    } else if (type === "agreement") {
      if(index >= 0 && index <= this.agrArr.length - 1){
        this.selectedRowIndex = index;
      } 
    } else if (type === "invoice") {
      if(index >= 0 && index <= this.invArr.length - 1){
        this.selectedRowIndex = index;
      } 
    }
  }

  caliberateTotal() {
    this.mAgrTotal = 0.0;
    this.mAgrDisc = 0.0;
    this.mAgrVAT = 0.0;
    this.mAgrGTotal = 0.0;
    for(let i=0; i<this.srvItem.length; i++) {
      this.mAgrTotal += this.srvItem.value[i].srvValue;
      this.mAgrDisc += this.srvItem.value[i].srvDiscount;
      this.mAgrVAT += this.srvItem.value[i].srvVat ;
      this.mAgrGTotal += this.srvItem.value[i].srvNetValue;
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
  
  get srvItem(): FormArray {
    return this.salesOrderForm.get('srvItemArr') as FormArray
  }

  public goToAgreement() {
    const soData = this.salesOrderForm.value;
    var id = soData.agrNbr;
    var myurl = `/crm/agreements/details/${id}`;
    this.router.navigateByUrl(myurl).then(e => {
    });
  }

  public goToInvoice() {
    const soData = this.salesOrderForm.value;
    var id = soData.invNbr;
    var myurl = `/crm/invoice/details/${id}`;
    this.router.navigateByUrl(myurl).then(e => {
    });
  }

}
