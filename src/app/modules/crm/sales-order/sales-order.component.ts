import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GridOptions } from 'ag-grid-community';
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
  agreementForm: FormGroup;
  
  SOArr: any[] = [];
  agrArr: any[] = [];
  selectedRowIndex: any = 0;
  sonumber: any;
  membArr: any[] = [];
  partyArr: any[] = [];
  srvArr: any[] = [];
  refArr: any[] = [];

  refIndex:number  = 0;
  srvIndex:number = 0;
  argIndex: number = 0;
  serviceIndex: number = 0;
  memberIndex: number = 0;
  valueIndex: number = 0;

  docArgNo: any;
  docArg: any;
  docInv: any;
  columnMemberDefs:any;
  taxArr: any;
  gridApi: any;
  gridColumnApi:any;
  memberList: any[] =[];
  searchValue: any;
  gridOptions!: Partial<GridOptions>;
  rowStyle!: { background: string; };
  discount: number;
  grossvalue: number;
  price:number = 0;

  mPartyName: string = "";
  mPartyId: string = "";
  mPartyPhone: string = "";
  mPartyAdd1: string = "";
  mPartyAdd2: string = "";
  mPartyAdd3: string = "";
  mPartyEmail: string = "";
  mPartyTelephone: string = "";
  mAgrTotal = 0;
  mAgrVAT = 0;
  mAgrDisc = 0;
  mAgrGTotal = 0;

  utc = new Date();
  mCurDate = this.formatDate(this.utc);
  mCYear = new Date().getFullYear();

  invReportApiUrl: string = "";
  invReportName: string = "";

  @ViewChild('SOLookUpDailouge') SOLookUpDailouge!: TemplateRef<any>;
  @ViewChild('agreementLookUpDialog') agreementLookUpDialog!: TemplateRef<any>;
  @ViewChild('membLookupDialog') membLookupDialog!: TemplateRef<any>;
  @ViewChild('partyLookupDialog') partyLookupDialog!: TemplateRef<any>;
  @ViewChild('sivLookupDialog') sivLookupDialog!: TemplateRef<any>;
  @ViewChild('RefLookupDialog') RefLookupDialog!: TemplateRef<any>;

  partyDisplayedColumns: string[] = [ 'pcode', 'cust_name', 'party_id', 'name', 'add1', 'add2', 'add3', 'phone1', 'mobile', 'email_id'];
  partyDataSource = new MatTableDataSource(this.partyArr);

  SalesOrderDisplayedColumns: string[] = ['sono', 'pcode', 'custname','total'];
  SalesOrderDataSource = new MatTableDataSource(this.SOArr);

  membDisplayedColumns: string[] = ['memberNo', 'memberRefNo', 'title', 'firstname', 'surname', 'cprno'];
  membDataSource = new MatTableDataSource(this.membArr);

  serviceDisplayedColumns: string[] = ['ServiceID', 'servicedesc', 'actualprice', 'memberprice'];
  serviceDataSouuce = new MatTableDataSource(this.srvArr);

  referenceDisplayedColumns: string[] = ['refid', 'name', 'desc', 'type'];
  referenceDataSouuce = new MatTableDataSource(this.refArr);

  constructor(private crmservice: CrmService,private dialog: MatDialog,private financeService: FinanceService,private lookupservice:LookupService,private dataSharing: DataSharingService ) {
    this.salesOrderForm = new FormGroup({
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
    });

    this.agreementForm = new FormGroup({
      serviceArr: new FormArray([])
    });

    this.columnMemberDefs = [
      { 
        headername: "Member Code",
        sortable: true ,
        field: "MemberNo", rowGroup: true,
        width: 200
      },
      { 
        headerName: "Member Name", 
        field: 'NAME', 
        width:300, 
        suppressMenu: false, 
        unSortIcon: true,
        sortable: true, 
        tooltipField: "NAME", 
        headerTooltip: "NAME" 
      },
      { 
        headerName: "Member SurName", 
        field: 'DEPT_NAME', 
        width:200, 
        suppressMenu: false, 
        unSortIcon: true,
        sortable: true, 
        tooltipField: "SURNAME", 
        headerTooltip: "SURNAME"
      },
      { 
        headerName: "Member Type", 
        field: 'MEMBTYPE', 
        width:40, 
        suppressMenu: false, 
        unSortIcon: true,
        sortable: true, 
        tooltipField: "MEMBTYPE", 
        headerTooltip: "MEMBTYPE"
      }
    ]
  } 

   refreshForm() {
    this.agrArr = [];
    this.docArgNo = '';
    this.docArg = '';
    this.mPartyName = "";
    this.mPartyPhone = "";
    this.mPartyId = "";
    this.mPartyAdd1 = "";
    this.mPartyAdd2 = "";
    this.mPartyAdd3 = "";
    this.mPartyEmail = "";
    this.mPartyTelephone = "";
    this.mAgrTotal = 0;
    this.mAgrVAT = 0;
    this.mAgrDisc = 0;
    this.mAgrGTotal = 0;
    this.salesOrderForm = new FormGroup({
      voucherNo: new FormControl('', [ Validators.required]),
      voucherDate: new FormControl('', [ Validators.required]),
      quotationNo: new FormControl('', [ Validators.required]),
      purchaseOrderNo: new FormControl('', [ Validators.required]),
      party: new FormControl('', [ Validators.required]),
      customerCode: new FormControl('', [ Validators.required]),
      name: new FormControl('', [ Validators.required]),
      add1: new FormControl('', [ Validators.required]),
      add2: new FormControl('', [ Validators.required]),
      add3: new FormControl('', [ Validators.required]),
      phoneNo: new FormControl('', [ Validators.required]),
      emailAddress: new FormControl('', [ Validators.required]),
      telephone: new FormControl('', [ Validators.required]),
      subject: new FormControl('', [ Validators.required]),
      srvItemArr: new FormArray([])
    });
    this.agreementForm = new FormGroup({
      serviceArr: new FormArray([])
    });
  }

   newForm() {
    this.mAgrTotal = 0;
    this.mAgrVAT = 0;
    this.mAgrDisc = 0;
    this.mAgrGTotal = 0;
    const year = String(this.mCYear);
    this.financeService.getDocForArg(year).subscribe((res: any) => {
      const yearStr = String(res.recordset[0].CYEAR).substring(2);
      this.docArgNo = res.recordset[0].FIELD_VALUE_NM + 1;
      this.docArg = 'AGR' + yearStr + '-' + this.docArgNo.toString();
      this.docInv = 'INV' + yearStr + '-' + this.docArgNo.toString();
      console.log(this.docArg);
      this.salesOrderForm = new FormGroup({
        voucherNo: new FormControl(this.docArg, [ Validators.required]),
        voucherDate: new FormControl(this.mCurDate, [ Validators.required]),
        quotationNo: new FormControl(this.docInv, [ Validators.required]),
        purchaseOrderNo: new FormControl('', [ Validators.required]),
        party: new FormControl('', [ Validators.required]),
        customerCode: new FormControl('', [ Validators.required]),
        name: new FormControl('', [ Validators.required]),
        add1: new FormControl('', [ Validators.required]),
        add2: new FormControl('', [ Validators.required]),
        add3: new FormControl('', [ Validators.required]),
        phoneNo: new FormControl('', [ Validators.required]),
        emailAddress: new FormControl('', [ Validators.required]),
        telephone: new FormControl('', [ Validators.required]),
        subject: new FormControl('', [ Validators.required]),
        srvItemArr: new FormArray([])
      });
      const salesorderGrid = new FormGroup({
        srvCode: new FormControl('', [ Validators.required]),
        srvDesc: new FormControl('', [ Validators.required]),
        srvMember: new FormControl('', [ Validators.required]),
        srvMemberName: new FormControl('', [ Validators.required]),
        srvFrom: new FormControl(this.mCurDate, [ Validators.required]),
        srvTo: new FormControl(this.mCurDate, [ Validators.required]),
        //srvArgItemArr: new FormArray([]),
        srvValue: new FormControl('', [ Validators.required]),
        srvDisc: new FormControl('', [ Validators.required]),
        srvDiscount: new FormControl('', [ Validators.required]),
        srvGross: new FormControl('', [ Validators.required]),
        srvVatCat: new FormControl('', [ Validators.required]),
        srvVat: new FormControl('', [ Validators.required]),
        srvNetValue: new FormControl('', [ Validators.required]),
      });
      this.srvItem.push(salesorderGrid);

      this.agreementForm = new FormGroup({
        serviceArr: new FormArray([])
      });

      const agreementGrid = new FormGroup({
        serviceNo: new FormControl('', [ Validators.required]),
        serviceDesc: new FormControl('', [Validators.required]),
        Price: new FormControl('', [ Validators.required]),
      });
      this.agrItem.push(agreementGrid);
    }, (err: any) => {
      console.log(err);
    })
  }

  lookupSalesorder(value: string) {
    console.log(value)
    this.selectedRowIndex = 0;
    let dialogRef = this.dialog.open(this.SOLookUpDailouge);    
    this.crmservice.searchagreementmaster(value).subscribe((res: any) => {
      this.SOArr = res.recordset;
      this.SalesOrderDataSource = new MatTableDataSource(this.SOArr);
    }, (err: any) => {
      console.log(err);
    })
  }

  getSalesorder(argno: any) {
    console.log(argno)
      this.crmservice.getagreementmaster(argno).subscribe((res: any) => {
        this.selectSalesOrder(res.recordset[0]);
        console.log(res.recordset)
      }, (err: any) => {
        console.log(err);
      })
  }

  lookupAgreementAndMember(index: any) {
    let dialogRef = this.dialog.open(this.agreementLookUpDialog);
    this.agreementForm = new FormGroup({
      serviceArr: new FormArray([])
    });
    if(this.agrArr[index]) {
      for(let i=0;i<this.agrArr[index].serviceArr.length;i++) {
        const agreementGrid = new FormGroup({
          serviceNo: new FormControl(this.agrArr[index].serviceArr[i].serviceNo, [ Validators.required]),
          serviceDesc: new FormControl(this.agrArr[index].serviceArr[i].serviceDesc, [Validators.required]),
          Price: new FormControl(this.agrArr[index].serviceArr[i].Price, [ Validators.required]),
        });
        this.agrItem.push(agreementGrid);
      }
    } else {
      const agreementGrid = new FormGroup({
        serviceNo: new FormControl('', [ Validators.required]),
        serviceDesc: new FormControl('', [Validators.required]),
        Price: new FormControl('', [ Validators.required]),
      });
      this.agrItem.push(agreementGrid);
    }
  }

  highlight(type: string, index: number){
    console.log(index)
    if (type === "salesorder") {
      if(index >= 0 && index <= this.SOArr.length - 1){
        this.selectedRowIndex = index;
      } 
    }
    else if (type === "membs") {
      if(index >= 0 && index <= this.membArr.length - 1){
        this.selectedRowIndex = index;
      }
    }
    else if(type === "srvs"){
      if(index >= 0 && index <= this.srvArr.length - 1){
        this.selectedRowIndex = index;
      }
    }
    else if(type === "ref"){
      if(index >= 0 && index <= this.refArr.length - 1){
        this.selectedRowIndex = index;
      }
    } 
    else if(type === "party"){
      if(index >= 0 && index <= this.partyArr.length - 1){
        this.selectedRowIndex = index;
      }
    } 
  }

  getTaxData(){
    this.financeService.getAllTaxCategory().subscribe((res: any) =>{
      this.taxArr = res.recordset
    },(err: any) => {
      console.log(err)
    })
  }

  lookUpMembers(value: string, index: number) {
    this.selectedRowIndex = 0;
    this.memberIndex = index;
    let dialogRef = this.dialog.open(this.membLookupDialog);
      this.crmservice.searchMembers(value).subscribe((res: any) => {
        this.membArr = res.recordset;
        this.membDataSource = new MatTableDataSource(this.membArr);
      }, (err: any) => {
        console.log(err);
      })
  } 

  lookUpParty(value: string) {
    this.selectedRowIndex = 0;
    this.crmservice.getPartyFromName(value).subscribe((res: any) => {
      console.log(res);
      this.partyArr = res.recordset;
      this.partyDataSource = new MatTableDataSource(this.partyArr);
      console.log(this.partyArr[0]);
      let dialogRef = this.dialog.open(this.partyLookupDialog);
    }, (err: any) => {
      console.log(err);
    })
    //this.selectParty(this.partyArr[0]);
  }

  lookUpReference(index: number) {
    this.selectedRowIndex = 0;
    this.serviceIndex = index;
    let dialogRef = this.dialog.open(this.RefLookupDialog);
      this.lookupservice.searchReference().subscribe((res: any) => {
        this.refArr = res.recordset;
        this.referenceDataSouuce = new MatTableDataSource(this.refArr);
      }, (err: any) => {
        console.log(err);
      })
  }

  selectSiv(){
    this.getsrvData(this.srvArr[this.selectedRowIndex].PCODE, this.srvIndex);
    const rowData: any = {
      serviceNo: this.srvArr[this.selectedRowIndex].ServiceID,
        serviceDesc: this.srvArr[this.selectedRowIndex].ServiceName,
        Price: this.srvArr[this.selectedRowIndex].MemberPrice,
    }
    this.agrItem.at(this.srvIndex).patchValue(rowData);
    let dialogRef = this.dialog.closeAll();
    let dialogRefs = this.dialog.open(this.agreementLookUpDialog);    
  }

  getRefData(pcode: any,index: any){
    console.log(pcode);    
    this.lookupservice.getRefcode(pcode).subscribe((res: any) => {
      const rowData: any = {
        srvCode: res.recordset[0].PCODE,
        srvDesc: res.recordset[0].NAME
      }
      this.srvItem.at(index).patchValue(rowData);
      console.log(res);
    }, (err: any) => {
      console.log(err);
    })
  }

  getdiscount(disc: any,index: any){
    const data = this.salesOrderForm.value
    this.discount = 0
    this.grossvalue = 0
    this.discount = data.srvItemArr[index].srvValue*disc/100
    this.grossvalue = data.srvItemArr[index].srvValue - this.discount
    const rowData: any = {
      srvDiscount: this.discount,
      srvGross: this.grossvalue
    }
    this.srvItem.at(index).patchValue(rowData);
  }

  selectRef(obj: any){
    console.log(obj.PCODE);
    // this.getRefData(obj.PCODE, index);
    const rowData: any = {
      srvCode: obj.PCODE,
      srvDesc: obj.NAME
    }
    this.srvItem.at(this.serviceIndex).patchValue(rowData);
    let dialogRef = this.dialog.closeAll();
  }

  lookUpSrv(value: string, index: number) {
    this.srvIndex = index;
    this.selectedRowIndex = 0;
    let dialogRef = this.dialog.open(this.sivLookupDialog);    
    this.financeService.searchServicesDetails(value).subscribe((res: any) => {
      this.srvArr = res.recordset;
      this.serviceDataSouuce = new MatTableDataSource(this.srvArr);
    }, (err: any) => {
      console.log(err);
    })
  }

  getsrvData(srvno: any,index:any) {
    this.financeService.getServiceDetails(srvno).subscribe((res: any) => {
      const rowData: any = {
        serviceNo: res.recordset[0].ServiceID,
        serviceDesc:res.recordset[0].ServiceName,
        Price: res.recordset[0].MemberPrice,
      }
      this.agrItem.at(index).patchValue(rowData);
      //let dialogRef = this.dialog.closeAll();
      console.log(res);
    }, (err: any) => {
      console.log(err);
    })
  }

  getMemberdata(memberno: any,index: any){
    console.log(memberno);    
    this.crmservice.getMembers(memberno).subscribe((res: any) => {
      const rowData: any = {
        srvMember: res.recordset[0].MemberNo,
        srvMemberName: res.recordset[0].NAME
      }
      this.srvItem.at(index).patchValue(rowData);
      console.log(res);
    }, (err: any) => {
      console.log(err);
    })
  } 

  gettaxValue(value: any,index:any){
    const data = this.salesOrderForm.value
    const vat = (data.srvItemArr[index].srvGross * value )/100
    const netvalue = data.srvItemArr[index].srvGross + vat
    const rowData: any = {
      srvVat: vat,
      srvNetValue: netvalue
    }
    this.srvItem.at(index).patchValue(rowData);
    this.caliberateTotal();
  }

  getValueData(argno: any,index: any){
    this.crmservice.getSumofMemberprice(argno).subscribe((res: any) =>{
      console.log(res)
      console.log(res.recordset[0].MEMBERPRICE);
      const rowData: any = {
        srvValue: res.recordset[0].MEMBERPRICE
      }
      this.srvItem.at(index).patchValue(rowData);
    })
    
    let dialogRef = this.dialog.closeAll();
  }

  onFormSubmit(){
    const agrData = this.salesOrderForm.value;
    console.log(agrData);    
    console.log(this.agrArr );
    this.financeService.checkAgreement(agrData.voucherNo).subscribe((res: any) => {
      this.financeService.updateAgreementMaster(agrData.quotationNo, agrData.voucherDate, agrData.customerCode, agrData.customerCode, agrData.name, agrData.add1, agrData.phoneNo, agrData.telephone, agrData.subject, this.mCurDate, 'DBA', agrData.voucherNo);
      console.log(res)
    }, (err: any) => {
      console.log(this.docArgNo);
      this.financeService.postAgreementMaster('01',agrData.quotationNo,agrData.voucherNo,this.mCurDate,this.docArg,agrData.customerCode,agrData.customerCode,agrData.name,String(this.mAgrTotal),String(this.mAgrDisc),String(this.mAgrGTotal),String(this.mAgrVAT),agrData.add1,agrData.phoneNo,agrData.telephone,agrData.subject,this.mCurDate,'DBA');
      for(let i=0; i<agrData.srvItemArr.length; i++) {
        this.financeService.postAgreementDetails(agrData.voucherNo,'01',agrData.srvItemArr[i].srvCode,agrData.srvItemArr[i].srvDesc,agrData.srvItemArr[i].srvMember,agrData.srvItemArr[i].srvMemberName,this.formatDate(agrData.srvItemArr[i].srvFrom),this.formatDate(agrData.srvItemArr[i].srvTo),agrData.srvItemArr[i].srvValue,agrData.srvItemArr[i].srvGross,agrData.srvItemArr[i].srvDisc,agrData.srvItemArr[i].srvDiscount,agrData.srvItemArr[i].srvVatCat,agrData.srvItemArr[i].srvVat,agrData.srvItemArr[i].srvNetValue,this.mCurDate,'DBA');
        /*for (let j=0; j<this.agrArr[i].serviceArr.length; j++) {
          const serArrData = this.agrArr[i].serviceArr[j];
          this.financeService.postAggrementBLA(agrData.srvItemArr[i].srvMember,agrData.voucherNo,serArrData.serviceNo,serArrData.Price,'01').subscribe((res: any) => {
            console.log(res);
          }, (err: any) => {
            console.log(err);
          });
        }*/
      }
      this.financeService.updatedocAgreement(this.docArgNo, String(this.mCYear));
    });
    //this.refreshForm();
  }

  selectMember(obj: any) {
    console.log(this.selectedRowIndex);
    console.log(this.membArr[this.selectedRowIndex]);
    console.log(this.membArr[this.selectedRowIndex].MemberNo);
    console.log(this.refIndex);
    this.getRefData(this.membArr[this.selectedRowIndex].PCODE, this.refIndex);
    const rowData: any = {
      srvMember: this.membArr[this.selectedRowIndex].MemberNo,
      srvMemberName: this.membArr[this.selectedRowIndex].NAME
    }
    this.srvItem.at(this.memberIndex).patchValue(rowData);
    let dialogRef = this.dialog.closeAll();
  }

  arrowDownEvent(type: string, index: number){
    this.highlight(type, ++index);
  }

  arrowUpEvent(type: string, index: number){
    this.highlight(type, --index);
  }
  
  selectParty(obj: any){
    console.log(obj);
    console.log(this.refIndex);
    this.salesOrderForm.patchValue({
      party: obj.name,
      customerCode: obj.pcode,
      name: obj.cust_name,
      add1: obj.add1,
      add2: obj.add2,
      add3: obj.add3,
      phoneNo: obj.phone1,
      emailAddress: obj.email_id ,
      telephone: obj.mobile,
    });
    this.mPartyName = obj.cust_name;
    this.mPartyAdd1 = obj.add1;
    this.mPartyAdd2 = obj.add2;
    this.mPartyAdd3 = obj.add3;
    this.mPartyPhone = obj.phone1;
    this.mPartyEmail = obj.email_id;
    this.mPartyTelephone = obj.mobile;
    let dialogRef = this.dialog.closeAll();
    this.getCustomerMember(obj.pcode)
  }

  selectSalesOrder(obj: any) {
    this.sonumber = obj.AGR_NO;
    this.invReportApiUrl = "coa/getinvoiceprint/" + obj.AGR_NO ;
    this.invReportName = "membership_inovice_MANZ.rdlx-json";
    console.log(obj);
    const date = this.formatDate(obj.AGR_DATE);
    // this.dptItems.clear();
    this.salesOrderForm.patchValue({
      voucherNo: obj.AGR_NO,
      voucherDate: date,
      quotationNo: obj.QUOTNO,
      purchaseOrderNo: obj.REFNO,
      party: obj.PARTY_ID,
      customerCode: obj.PCODE,
      name: obj.CUST_NAME,
      add1: obj.CUST_ADD1,
      phoneNo: obj.CUST_PHONE1,
      emailAddress: obj.CUST_ADD2,
      telephone: obj.CUST_ADD3,
      subject: obj.REMARKS,
    });
    this.mPartyName = obj.CUST_NAME;
    this.mPartyAdd1 = obj.CUST_ADD1;
    this.mPartyAdd2 = obj.CUST_ADD2;
    this.mPartyAdd3 = obj.CUST_ADD3;
    this.mPartyPhone = obj.CUST_PHONE1;
    this.mPartyEmail = obj.CUST_PHONE1;
    this.mPartyTelephone = obj.CUST_PHONE1;
    this.crmservice.getagreementDetails(this.sonumber).subscribe((res: any) => {
      const itemArr = res.recordset;
      for(let x=0; x<itemArr.length; x++) {
        const salesorderGrid = new FormGroup({
          srvCode: new FormControl(itemArr[x].ITCODE, [ Validators.required]),
          srvDesc: new FormControl(itemArr[x].DESCRIPTION, [ Validators.required]),
          srvMember: new FormControl(itemArr[x].MEMBERCODE, [ Validators.required]),
          srvMemberName: new FormControl(itemArr[x].MEMBERNAME, [ Validators.required]),
          srvFrom: new FormControl(itemArr[x].FROMDT, [ Validators.required]),
          srvTo: new FormControl(itemArr[x].TODT, [ Validators.required]),
          srvValue: new FormControl(itemArr[x].VALUE1, [ Validators.required]),
          srvDisc: new FormControl(itemArr[x].DISPER, [ Validators.required]),
          srvDiscount: new FormControl(itemArr[x].DISAMT, [ Validators.required]),
          srvGross: new FormControl(itemArr[x].PRICE, [ Validators.required]),
          srvVatCat: new FormControl(itemArr[x].VATCATEORY, [ Validators.required]),
          srvVat: new FormControl(itemArr[x].VAT, [ Validators.required]),
          srvNetValue: new FormControl(itemArr[x].AMOUNT, [ Validators.required]),
        });
        this.srvItem.push(salesorderGrid);
        this.caliberateTotal();
      }
    }, (error: any) => {
      console.log(error);
    })
    let dialogRef = this.dialog.closeAll();
  }

  onGridMemberReady(params: any){ 
    const data = this.salesOrderForm.value
    this.gridApi= params.api;
    this.gridColumnApi= params.columnApi;
    this.financeService.getCustomerMemner(data.srvMember).subscribe((res: any) =>  {
      console.log(this.memberList);
      this.memberList=res.recordset;
      params.api.setRowData(this.memberList);
      console.log(this.memberList);
    }, (error: any) => {
      console.log(error);
    });
  }

  getCustomerMember(pcode:string) {
    this.financeService.getCustomerMemner(pcode).subscribe((res: any) => {
      this.memberList = res.recordset;
      console.log(this.memberList)
    }, (err: any) => {
      console.log(err);
    })
  }

  quickMemberSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  ngOnInit(): void {
    this.getTaxData();
    const data = this.salesOrderForm.value
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
      console.log(this.srvItem)
    } else {
      this.srvItem.removeAt(index);
    }
  }

  addServiceItem() {
    const ServicGrid = new FormGroup({
      srvCode: new FormControl('', [ Validators.required]),
      srvDesc: new FormControl('', [ Validators.required]),
      srvMember: new FormControl('', [ Validators.required]),
      srvMemberName: new FormControl('', [ Validators.required]),
      srvFrom: new FormControl('', [ Validators.required]),
      srvTo: new FormControl('', [ Validators.required]),
      //srvArgItemArr: new FormArray([]),
      srvValue: new FormControl('', [ Validators.required]),
      srvDisc: new FormControl('', [ Validators.required]),
      srvDiscount: new FormControl('', [ Validators.required]),
      srvGross: new FormControl('', [ Validators.required]),
      srvVatCat: new FormControl('', [ Validators.required]),
      srvVat: new FormControl('', [ Validators.required]),
      srvNetValue: new FormControl('', [ Validators.required]),
    });
    this.srvItem.push(ServicGrid);
  }

  addAgreementItem() {
    const agreementGrid = new FormGroup({
      serviceNo: new FormControl('', [ Validators.required]),
      serviceDesc: new FormControl('', [Validators.required]),
      Price: new FormControl('', [ Validators.required]),
    });
    this.agrItem.push(agreementGrid);
  }

  deleteAgreementItem(index: number) {
    if(this.agrItem.length === 1){
      console.log(this.agrItem)
    } else {
      this.agrItem.removeAt(index);
    }
  }

  captureGridIndex(index: number){
    this.valueIndex = index;
  }

  submitAgreement() {
    const data = this.agreementForm.value;
    var value = 0;
    console.log(this.valueIndex);
    console.log(this.agrArr.length);
    console.log(this.agrArr);
    //console.log(data);
    if(this.valueIndex===this.agrArr.length) {
      this.agrArr.push(data);
    } else {      
      this.agrArr.splice(this.valueIndex,1,data);
    }
    for(let i=0; i<this.agrArr[this.valueIndex].serviceArr.length; i++) {
      console.log(this.agrArr[this.valueIndex].serviceArr[i].Price);
      value = value + this.agrArr[this.valueIndex].serviceArr[i].Price;
      console.log(this.agrArr);
    }
    console.log(value);
    const rowData: any = {
      srvValue: value
    }
    this.srvItem.at(this.valueIndex).patchValue(rowData);
    let dialogRef = this.dialog.closeAll();
  }

  caliberateTotal() {
    this.mAgrTotal = 0;
    this.mAgrDisc = 0;
    this.mAgrVAT = 0;
    this.mAgrGTotal = 0;
    for(let i=0; i<this.srvItem.length; i++) {
     // console.log(this.srvItem);
      this.mAgrTotal = this.mAgrTotal + this.srvItem.value[i].srvValue;
      this.mAgrDisc = this.mAgrDisc + this.srvItem.value[i].srvDiscount;
      this.mAgrVAT = this.mAgrVAT + this.srvItem.value[i].srvVat;
      this.mAgrGTotal = this.mAgrTotal - this.mAgrDisc + this.mAgrVAT;
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

  get agrItem(): FormArray {
    return this.agreementForm.get('serviceArr') as FormArray
  }
}
