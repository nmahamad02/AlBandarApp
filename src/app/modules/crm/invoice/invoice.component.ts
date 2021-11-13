import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { CrmService } from 'src/app/services/crm/crm.service';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  inoviceForm: FormGroup;
  invoiceDetail: FormArray = new FormArray([]);
  gridOptions!: Partial<GridOptions>;  
  invoiceFooter: FormGroup;
  columndef : any;
  gridapi : any;
  gridColumnApi: any;
  currentYear = new Date().getFullYear()
  invoiceList: any;
  searchValue: any;
  rowStyle!: { background: string; };

  invReportApiUrl: string = "";
  invReportName: string = "";

  constructor(private crmservice: CrmService, private dataSharing: DataSharingService){ 
    this.inoviceForm = new FormGroup({
      invNO: new FormControl('', [ Validators.required]),
      invDate: new FormControl('', [ Validators.required]),
      invBillTo: new FormControl('', [ Validators.required]),
      invCustType: new FormControl('', [ Validators.required]),
      invArgNO: new FormControl('', [ Validators.required]),
      invName: new FormControl('', [ Validators.required]),
      InvContactName: new FormControl('', [ Validators.required]),
      invContactNo: new FormControl('', [ Validators.required]),
      invBillAdd: new FormControl('', [ Validators.required]),
      invEmailAdd: new FormControl('', [ Validators.required]),
      invTelPhono: new FormControl('', [ Validators.required]),
    });
    this.invoiceFooter = new FormGroup({
      siIssueRecievedBy: new FormControl('', [ Validators.required]),
      siIssueIssuedBy: new FormControl('', [ Validators.required]),
      siIssueApprovedBy: new FormControl('', [ Validators.required]),
    });
    this.columndef = [
      { 
        headername: "Proudct ID",
        sortable: true,
        field: "PCODE",
        width: 85
      },
      { 
        headerName: "NAME", 
        field: 'CUST_NAME', 
        width:250, 
        suppressMenu: false, 
        unSortIcon: true,
        sortable: true,
        tooltipField: "NAME", 
        headerTooltip: "NAME" 
      },
      { 
        headername: "Mobile",
        field: "MOBILE",
        filter: true,
        rowGroup:true,
        enableRowGroup: true,
        width:75
      },
    ];
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


}
