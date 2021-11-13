import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CrmService } from 'src/app/services/crm/crm.service';

@Component({
  selector: 'sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.scss']
})
export class SalesOrderComponent implements OnInit {
  salesOrderForm: FormGroup;
  
  SOArr: any[] = [];
  selectedRowIndex: any = 0;
  sonumber: any;
  @ViewChild('SOLookUpDailouge') SOLookUpDailouge!: TemplateRef<any>;
  
  SalesOrderDisplayedColumns: string[] = ['sono', 'pcode', 'custname','total'];
  SalesOrderDataSource = new MatTableDataSource(this.SOArr);

  constructor(private crmservice: CrmService,private dailog: MatDialog) {
    this.salesOrderForm = new FormGroup({
      voucherNo: new FormControl('', [ Validators.required]),
      voucherDate: new FormControl('', [ Validators.required]),
      quotationNo: new FormControl('', [ Validators.required]),
      purchaseOrderNo: new FormControl('', [ Validators.required]),
      party: new FormControl('', [ Validators.required]),
      customerCode: new FormControl('', [ Validators.required]),
      name: new FormControl('', [ Validators.required]),
      address: new FormControl('', [ Validators.required]),
      phoneNo: new FormControl('', [ Validators.required]),
      emailAddress: new FormControl('', [ Validators.required]),
      telephone: new FormControl('', [ Validators.required]),
      subject: new FormControl('', [ Validators.required]),
      srvItemArry: new FormArray([])
    });
   }

   lookupSalesorder(value: string) {
    console.log(value)
    this.selectedRowIndex = 0;
    let dialogRef = this.dailog.open(this.SOLookUpDailouge);    
    this.crmservice.searchSoMaster(value).subscribe((res: any) => {
      this.SOArr = res.recordset;
      this.SalesOrderDataSource = new MatTableDataSource(this.SOArr);
    }, (err: any) => {
      console.log(err);
    })
  }

  getSalesorder(sono: any) {
    this.crmservice.getSOmaster(sono).subscribe((res: any) => {
      this.selectSalesOrder(res.recordset[0]);
      console.log(res.recordset)
    }, (err: any) => {
      console.log(err);
    })
  }

  highlight(type: string, index: number){
    console.log(index)
    if (type === "salesorder") {
      if(index >= 0 && index <= this.SOArr.length - 1){
        this.selectedRowIndex = index;
      }
    }
  }

  arrowDownEvent(type: string, index: number){
    this.highlight(type, ++index);
  }

  arrowUpEvent(type: string, index: number){
    this.highlight(type, --index);
  }

  selectSalesOrder(obj: any) {
    this.sonumber = obj.SONO
    console.log(obj);
    // this.dptItems.clear();
    this.salesOrderForm.patchValue({
      voucherNo: obj.SONO,
      voucherDate: obj.SODATE,
      quotationNo: obj.QUOTNO,
      purchaseOrderNo: obj.REFNO,
      party: obj.PARTY_ID,
      customerCode: obj.PCODE,
      name: obj.CUST_NAME,
      address: obj.CUST_ADD1,
      phoneNo: obj.CUST_PHONE1,
      emailAddress: obj.CUST_ADD2,
      telephone: obj.CUST_ADD3,
      subject: obj.REMARKS,
    });
    this.crmservice.getSoDetails(this.sonumber).subscribe((res: any) => {
      const itemArr = res.recordset;
      for(let x=0; x<itemArr.length; x++) {
              const salesorderGrid = new FormGroup({
                srvCode: new FormControl(itemArr[x].ITCODE, [ Validators.required]),
                srvCategory: new FormControl(itemArr[x].ITDESC, [ Validators.required]),
                srvDescription: new FormControl(itemArr[x].DESCRIPTION, [ Validators.required]),
                srvQunt: new FormControl(itemArr[x].TOTQTY, [ Validators.required]),
                srvUnitprice: new FormControl(itemArr[x].PRICE, [ Validators.required]),
                srvValue: new FormControl(itemArr[x].QUANTITYAMOUNT, [ Validators.required]),
                srvDiscper: new FormControl(itemArr[x].DISCRATE, [ Validators.required]),
                srvDiscount: new FormControl(itemArr[x].TOTALDISC, [ Validators.required]),
                srvNetvalue: new FormControl(itemArr[x].NETAMOUNT, [ Validators.required]),
                srvTax: new FormControl(itemArr[x].TAX_1_AMT, [ Validators.required]),
              });
              this.srvItem.push(salesorderGrid);
            }
        }, (error: any) => {
          console.log(error);
        })
    let dialogRef = this.dailog.closeAll();
  }

  ngOnInit(): void {
  }

  deleteServiceItem(index: number) {
    if(this.srvItem.length === 1){
      console.log(this.srvItem)
    } else {
      this.srvItem.removeAt(index);
    }
    //this.siItem.last.nativeElement.focus();
  }

  addServiceItem() {
    const ServicGrid = new FormGroup({
      srvCode: new FormControl('', [ Validators.required]),
      srvCategory: new FormControl('', [ Validators.required]),
      srvDescription: new FormControl('', [ Validators.required]),
      srvQunt: new FormControl('', [ Validators.required]),
      srvUnitprice: new FormControl('', [ Validators.required]),
      srvValue: new FormControl('', [ Validators.required]),
      srvDiscper: new FormControl('', [ Validators.required]),
      srvDiscount: new FormControl('', [ Validators.required]),
      srvNetvalue: new FormControl('', [ Validators.required]),
      srvTax: new FormControl('', [ Validators.required]),
    });
    this.srvItem.push(ServicGrid);
  // }
  }

  submitForm() {
    const data = this.salesOrderForm.value;
    console.log(data);
  }

  get srvItem(): FormArray {
    return this.salesOrderForm.get('srvItemArry') as FormArray
  }
}
