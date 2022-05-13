import { Component, OnInit, TemplateRef, ViewChild, ElementRef} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GridOptions } from 'ag-grid-community';
import { CrmService } from 'src/app/services/crm/crm.service';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  columns: any[];
  invoiceList: any[] = [];
  invoiceDataSource = new MatTableDataSource(this.invoiceList);

  inoviceForm: FormGroup;
  invoiceDetail: FormArray = new FormArray([]);
  gridOptions!: Partial<GridOptions>;  
  invoiceFooter: FormGroup;
  columndef : any;
  gridapi : any;
  gridColumnApi: any;
  currentYear = new Date().getFullYear()
  searchValue: any;
  rowStyle!: { background: string; };
  selectedRowIndex: any = 0;
  partyArr: any[] = [];
  
  invIndex: number = 0;

  invReportApiUrl: string = "";
  invReportName: string = "";

  mPartyName: string = "";
  mPartyId: string = "";
  mPartyPhone: string = "";
  mPartyAdd1: string = "";
  mPartyAdd2: string = "";
  mPartyAdd3: string = "";
  mPartyEmail: string = "";
  mPartyTelephone: string = "";
  refArr: any[] = [];
  
  @ViewChild('partyLookupDialog') partyLookupDialog!: TemplateRef<any>;
  @ViewChild('RefLookupDialog') RefLookupDialog!: TemplateRef<any>;

  partyDisplayedColumns: string[] = [ 'pcode', 'cust_name', 'party_id', 'name', 'add1', 'add2', 'add3', 'phone1', 'mobile', 'email_id'];
  partyDataSource = new MatTableDataSource(this.partyArr);

  referenceDisplayedColumns: string[] = ['refid', 'name', 'desc', 'type'];
  referenceDataSouuce = new MatTableDataSource(this.refArr);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;

  constructor(private crmservice: CrmService, private dataSharing: DataSharingService, private dialog: MatDialog, private lookupservice: LookupService, private router: Router){
    this.inoviceForm = new FormGroup({
      invNO: new FormControl('', [ Validators.required]),
      invDate: new FormControl('', [ Validators.required]),
      invBillTo: new FormControl('', [ Validators.required]),
      invCustType: new FormControl('', [ Validators.required]),
      invArgNO: new FormControl('', [ Validators.required]),
      invName: new FormControl('', [ Validators.required]),
      InvContactName: new FormControl('', [ Validators.required]),
      invContactNo: new FormControl('', [ Validators.required]),
      invArgMasterNo: new FormControl('', [ Validators.required]),
      invEmailAdd: new FormControl('', [ Validators.required]),
      invSubject: new FormControl('', [ Validators.required]),
      invitemArray: new FormArray([])
    });
    const invoicegrid = new FormGroup({
      invCode: new FormControl('', [ Validators.required]),
      invDesc: new FormControl('', [ Validators.required]),
      invQty: new FormControl('', [ Validators.required]),
      invUOM: new FormControl('', [ Validators.required]),
      invAmt: new FormControl('', [ Validators.required]),
      invDisc: new FormControl('', [ Validators.required]),
      //srvArgItemArr: new FormArray([]),
      invDiscAmt: new FormControl('', [ Validators.required]),
      invNetAmt: new FormControl('', [ Validators.required]),
      invVatType: new FormControl('', [ Validators.required]),
      invVatAmt: new FormControl('', [ Validators.required]),
      invVatAmtincl: new FormControl('', [ Validators.required]),
      invDept: new FormControl('', [ Validators.required]),
      invArg: new FormControl('', [ Validators.required]),
      invCostCenter: new FormControl('', [ Validators.required]),
    });
    this.invItem.push(invoicegrid);

    this.invoiceFooter = new FormGroup({
      siIssueRecievedBy: new FormControl('', [ Validators.required]),
      siIssueIssuedBy: new FormControl('', [ Validators.required]),
      siIssueApprovedBy: new FormControl('', [ Validators.required]),
    });

    this.columns = ["PCODE", "CUST_NAME", "MOBILE", "Actions"];
  }
  onGridCustomerReady(params: any){ 
    this.gridapi= params.api;
    this.gridColumnApi= params.columnApi;
    this.crmservice.getCustomerAcc(String(this.currentYear)).subscribe((res: any) =>  {
      console.log(this.invoiceList);
      this.invoiceList=res.recordset;
      params.api.setRowData(this.invoiceList);
      console.log(this.invoiceList);
    }, (error: any) => {
      console.log(error);
    });
  }
  quickInvoiceSearch() {
    this.gridapi.setQuickFilter(this.searchValue);
  }

  ngOnInit(): void {
    this.invReportApiUrl = "crm/getCustomerAcc/" + this.currentYear;
    this.invReportName = "invoicereport.rdlx-json";

    this.crmservice.getCustomerAcc(String(this.currentYear)).subscribe((res: any) => {
      this.invoiceList = res.recordset;
      this.invoiceDataSource = new MatTableDataSource(this.invoiceList);
      this.invoiceDataSource.sort = this.sort;
      this.invoiceDataSource.paginator = this.paginator;
    }, (error: any) => {
      console.log(error);
    });

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

  highlight(type: string, index: number){
    console.log(index)
    if(type === "party"){
      if(index >= 0 && index <= this.partyArr.length - 1){
        this.selectedRowIndex = index;
      }
    }else if (type == "ref"){
      if(index >= 0 && index <= this.partyArr.length - 1){
        this.selectedRowIndex = index;
      }
    }
  }

  selectRef(obj: any){
    console.log(obj.PCODE);
    // this.getRefData(obj.PCODE, index);
    const rowData: any = {
      invCode: obj.PCODE,
      invDesc: obj.NAME
    }
    this.invItem.at(this.invIndex).patchValue(rowData);
    let dialogRef = this.dialog.closeAll();
  }

  selectParty(obj: any){
    console.log(obj);
    this.inoviceForm.patchValue({
      invContactNo : obj.pcode,
      InvContactName: obj.name
    })
    this.mPartyName = obj.cust_name;
    this.mPartyAdd1 = obj.add1;
    this.mPartyAdd2 = obj.add2;
    this.mPartyAdd3 = obj.add3;
    this.mPartyPhone = obj.phone1;
    this.mPartyEmail = obj.email_id;
    this.mPartyTelephone = obj.mobile;
    let dialogRef = this.dialog.closeAll();
  }

  arrowDownEvent(type: string, index: number){
    this.highlight(type, ++index);
  }

  arrowUpEvent(type: string, index: number){
    this.highlight(type, --index);
  }

  lookUpReference(index: number) {
    this.selectedRowIndex = 0;
    this.invIndex = index;
    let dialogRef = this.dialog.open(this.RefLookupDialog);
      this.lookupservice.searchReference().subscribe((res: any) => {
        this.refArr = res.recordset;
        this.referenceDataSouuce = new MatTableDataSource(this.refArr);
      }, (err: any) => {
        console.log(err);
      })
  }

  getRefData(pcode: any,index: any){
    console.log(pcode);    
    this.lookupservice.getRefcode(pcode).subscribe((res: any) => {
      const rowData: any = {
        invCode: res.recordset[0].PCODE,
        invDesc: res.recordset[0].NAME
      }
      this.invItem.at(index).patchValue(rowData);
      console.log(res);
    }, (err: any) => {
      console.log(err);
    })
  }

  addUnit() {
    const InoviceIssue = new FormGroup({
      siItemCode: new FormControl('', [ Validators.required]),
      siDesc: new FormControl('', [ Validators.required]),
      siQty: new FormControl('', [ Validators.required]),
      siUoM: new FormControl('', [ Validators.required]),
      siCP: new FormControl('', [ Validators.required]),
      siSP: new FormControl('', [ Validators.required]),
      siDept: new FormControl('', [ Validators.required]),
      siJob: new FormControl('', [ Validators.required]),
      siCostCtr: new FormControl('', [ Validators.required]),
    });
    this.invoiceDetail.push(InoviceIssue);
    console.log(this.invoiceDetail);
  }

  deleteUnit(index: number) {
    this.invoiceDetail.removeAt(index);
  }

  setReportData(apiUrl: string, reportType: string){
    const reportData = {
      apiUrl: apiUrl,
      reportType: reportType
    };
    this.dataSharing.setData(reportData);
  }

  get invItem(): FormArray {
    return this.inoviceForm.get('invitemArray') as FormArray
  }

  quickPartyrSearch() {

    this.invoiceDataSource.filter = this.searchValue.trim().toLowerCase();
  }

  public gotoInvoiceDetails(url, id) {
    var myurl = `${url}/${id}`;
    this.router.navigateByUrl(myurl).then(e => {

    });
  }

}
