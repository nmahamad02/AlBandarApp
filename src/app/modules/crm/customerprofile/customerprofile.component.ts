import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
//import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
//import { Color, Label } from 'ng2-charts';
import * as moment from 'moment';
import { FinanceService } from 'src/app/services/finance/finance.service';

@Component({
  selector: 'app-customerprofile',
  templateUrl: './customerprofile.component.html',
  styleUrls: ['./customerprofile.component.scss']
})
export class CustomerprofileComponent implements OnInit {
  public custForm: FormGroup;
  currentYear = new Date().getFullYear()
  searchValue: any;
  gridOptions!: Partial<GridOptions>;
  customerlist: any[] = [];
  CustPartyList: any[] = [];
  CustMemberList: any[] = [];
  CustInvoiceList: any[] = [];
  CustAgreementList: any[] = [];
  AccountsCategoryList: any[] = [];
  AccountsTypeList: any[] = [];
  gridApi: any;
  gridColumnApi:any;
  gridApiCust: any;
  gridColumnApiCust:any;
  columnCustomerDefs:any;
  columnContactDefs:any;
  columnCustomeropeningDefs:any;
  columnCustomerMemberDefs: any;
  columnCustomerAgreementDefs: any;

  rowStyle!: { background: string; };
  sortingOrder:any;
  mAccountDetails: any = {
    Cust_name: "",
    mOpbal: 0,
    mDebit: 0,
    mCredit: 0
  }
  
  varName: string = "";
  varAccountCategory: any ;
  varAccountType: string = "";
  varBranch: string = "";
  varAccountGroup: string = "";
  varAccountGroupName: string="";
  varexcode:string ="";
  varcreditPeriod: string ="";
  varActive:string = "";
  varLimit:string = "";
  varCrCpr:string = "";
  varTaxNo: string = "";
  varselected: string = "";
  varpcode:string = "";
  varsfyear:string ="2021-01-01";
  varefyear:string ="2021-01-01";
  opbalChartBool: boolean = false;
  /*varInvChartLabels: any[] = [];
  varInvChartValues: any[] = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = this.varInvChartLabels;
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartDataSets[] = [
    { data: this.varInvChartValues, label: 'Ageing' },
  ];
  public barChartColors: Color[] = [
    { backgroundColor: 'rgb(2, 46, 82)' }
  ];*/

  constructor(private financeservice:FinanceService){ 
    this.custForm = new FormGroup({
      pcode: new FormControl({value: 'Pcode', disabled: true}),
      cname: new FormControl('', [ Validators.required]),
      cAccountCategory: new FormControl('', [ Validators.required]),
      cAccountGroup: new FormControl('', [ Validators.required]),
      CAccountGroupName: new FormControl('', [ Validators.required]),
      cType: new FormControl('', [ Validators.required]),
      cBranch: new FormControl('', [ Validators.required]),
      cExternalCode: new FormControl('', [ Validators.required]),
      cCreditPeriod: new FormControl('', [ Validators.required]),
      cLimit: new FormControl('', [ Validators.required]),
      cCR: new FormControl('', [ Validators.required]),
      cActive: new FormControl('', [ Validators.required]),
      cTaxNo: new FormControl('', [ Validators.required])
    });

    this.columnCustomerDefs = [
      { 
        headername: "Customer ID",
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
        headername: "TYPE",
        field: "TYPE",
        filter: true,
        rowGroup:true,
        enableRowGroup: true,
        width:75
      },
      { 
        headername: "ADDRESS I",
        filter: true,
        sortable: true,
        field: "ADD1",
        width:150,
        rowGroup:true
      },
      { 
        headername: "ADDRESS II",
        filter: true,
        sortable: true,
        field: "ADD2",
        width:150
      },
      { 
        headername: "MOBILE",
        filter: true,
        field: "MOBILE",
        width:100
      },
      { 
        headername: "EMAIL",
        filter: true,
        field: "EMAIL_ID",
        width:200
      }
    ];

    this.columnCustomeropeningDefs = [
      { 
        headername: "INVOICE",
        sortable: true ,
        field: "INV_NO", rowGroup: true,
        width: 150
      },
      { 
        headerName: "DESCRIPTION", 
        field: 'DESCRIPTION', 
        width:450, 
        suppressMenu: false, 
        unSortIcon: true,
        sortable: true, 
        tooltipField: "DESCRIPTION", 
        headerTooltip: "DESCRIPTION" 
      },
      { 
      //  headername: "INVOICE AMOUNT",
       // field: "INV_AMOUNT",
       /// filter: true,
        //rowGroup:true,
        //enableRowGroup: true,
        //width:100
        
          headername: "INVOICE AMOUNT",
          filter: true,
          field: "INV_AMOUNT",
          cellRenderer: (params:any) => {
            var usdFormate = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'BHD',
              minimumFractionDigits: 3
            });
            return usdFormate.format(params.value);
          },
          width:200
             
      },
      { 
        headername: "INV_DATE",
        cellRenderer: (data: any) => {
          return moment(data.createdAt).format('DD/MM/YYYY')
        },
        filter: true,sortable: true,
        field: "INV_DATE",
        width:100
      },
      { 
        headername: "REFNO",
        filter: true,
        sortable: true,
        field: "REFNO",
        width:150
      },
      { 
        headername: "REFDATE",
        filter: true,
        field: "REFDT",
        cellRenderer: (data: any) => {
          return moment(data.createdAt).format('DD/MM/YYYY')
        },
        width:100
      },
      { 
        headername: "REF_AMOUNT",
        filter: true,
        field: "REFAMOUNT",
        cellRenderer: (params:any) => {
          var usdFormate = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BHD',
            minimumFractionDigits: 3
          });
          return usdFormate.format(params.value);
        },
        width:200
      }
    ];
    
    this.columnContactDefs = [
      { 
        headername: "Party ID",
        sortable: true ,
        field: "PARTY_ID",
        width: 85
      },
      { 
        headerName: "NAME", 
        field: 'NAME', 
        width:250, 
        suppressMenu: false, 
        unSortIcon: true,
        sortable: true,
        tooltipField: "NAME", 
        headerTooltip: "NAME" 
      },
      { 
        headername: "TYPE",
        field: "TYPE",
        filter: true,
        rowGroup:true,
        enableRowGroup: true,
        width:75
      },
      { 
        headername: "ADDRESS I",
        filter: true,
        sortable: true,
        field: "ADD1",
        width:150
      },
      { 
        headername: "ADDRESS II",
        filter: true,
        sortable: true,
        field: "ADD2",
        width:150
      },
      { 
        headername: "MOBILE",
        filter: true,
        field: "MOBILE",
        width:100
      },
      { 
        headername: "EMAIL",
        filter: true,
        field: "EMAIL_ID",
        width:200
      }
    ];
    
    this.columnCustomerAgreementDefs = [
      { 
        headername: "Agreement Number",
        sortable: true ,
        field: "AGR_NO",
        width: 85
      },
      { 
        headerName: "NAME", 
        field: 'AGR_CUST_NAME', 
        width:250, 
        suppressMenu: false, 
        unSortIcon: true,
        sortable: true,
        tooltipField: "AGR_CUST_NAME", 
        headerTooltip: "AGR_CUST_NAME" 
      },
      { 
        headername: "Department Name",
        field: "DEPT_NAME",
        filter: true,
        rowGroup:true,
        enableRowGroup: true,
        width:75
      },
      { 
        headername: "ADDRESS I",
        filter: true,
        sortable: true,
        field: "AGR_ADD1",
        width:150
      },
      { 
        headername: "ADDRESS II",
        filter: true,
        sortable: true,
        field: "AGR_ADD2",
        width:150
      },
      { 
        headername: "MOBILE",
        filter: true,
        field: "AGR_PHONE1",
        width:100
      },
      { 
        headername: "Total",
        filter: true,
        field: "TOTAL",
        width:200
      }
    ];
    this.columnCustomerMemberDefs = [
      { 
        headername: "MEMBER NUMBER",
        sortable: true ,
        field: "MemberNo",
        width: 85
      },
      { 
        headerName: "NAME", 
        field: 'NAME', 
        width:250, 
        suppressMenu: false, 
        unSortIcon: true,
        sortable: true,
        tooltipField: "NAME", 
        headerTooltip: "NAME" 
      },
      { 
        headername: "APPROVDT",
        field: "APPROVDT",
        filter: true,
        rowGroup:true,
        enableRowGroup: true,
        width:150
      },
      { 
        headername: "EMPLOYEER",
        filter: true,
        sortable: true,
        field: "EMPLOYER",
        width:200
      },
      { 
        headername: "CPR NO",
        filter: true,
        sortable: true,
        field: "CPRNo",
        width:150
      },
    ];
  }

  onGridCustomerReady(params: any){ 
    this.gridApi= params.api;
    this.gridColumnApi= params.columnApi;
    this.financeservice.getCustomerList(String(this.currentYear)).subscribe((res: any) =>  {
      console.log(this.customerlist);
      this.customerlist=res.recordset;
      params.api.setRowData(this.customerlist);
      console.log(this.customerlist);
    }, (error: any) => {
      console.log(error);
    });
  }

  onGridCustomerParty(params: any){ 
    this.gridApiCust= params.api;
    this.gridColumnApiCust= params.columnApi;
    this.financeservice.getCustomerParty(this.varpcode).subscribe((res: any) => {
      this.CustPartyList = res.recordset;
      console.log(this.CustPartyList);
      params.api.setRowData(this.CustPartyList);
    }, (err: any) => {
      console.log(err);
    })
  }

  onGridCustomerMember(params: any){ 
    this.gridApiCust= params.api;
    this.gridColumnApiCust= params.columnApi;
    this.financeservice.getCustomerMemner(this.varpcode).subscribe((res: any) =>  {
      console.log(this.CustMemberList);
      this.CustMemberList=res.recordset;
      params.api.setRowData(this.CustMemberList);
      console.log(this.CustMemberList);
    }, (error: any) => {
      console.log(error);
    });
  }

  onGridCustomerAgreement(params: any){ 
    this.gridApiCust= params.api;
    this.gridColumnApiCust= params.columnApi;
    this.financeservice.getCustomerMemner(this.varpcode).subscribe((res: any) =>  {
      console.log(this.CustAgreementList);
      this.CustAgreementList=res.recordset;
      params.api.setRowData(this.CustAgreementList);
      console.log(this.CustAgreementList);
    }, (error: any) => {
      console.log(error);
    });
  }

  onGridCustomerOpeningDetail(params: any){ 
    this.gridApiCust= params.api;
    this.gridColumnApiCust= params.columnApi;
    this.financeservice.getCustomerInvoices(this.varpcode, this.varsfyear, this.varefyear).subscribe((res: any) => {
      this.CustInvoiceList = res.recordset;
      console.log(this.CustInvoiceList);
      params.api.setRowData(this.CustInvoiceList);
      /*for(let i=0; i<this.CustInvoiceList.length; i++) {
        var tempChartLbl: string = this.CustInvoiceList[i].INV_NO;
        var tempChartVal: number = this.CustInvoiceList[i].INV_AMOUNT;
        this.varInvChartLabels.push(tempChartLbl);
        this.varInvChartValues.push(tempChartVal);
      }
      console.log(this.varInvChartLabels);
      console.log(this.varInvChartValues);*/
    }, (err: any) => {
      console.log(err);
    })
  }


  onViewCellClicked(event: any){
    console.log(event.data);
    if (event.column.colId =="CUST_NAME" ){
     this.varName = event.data.CUST_NAME;
     this.varAccountCategory= event.data.ACCOUNT_CATEGORY_DESC;
     this.varBranch= event.data.BRANCH_NAME;
     this.varAccountType = event.data.ACCOUNT_TYPE_CD;
     this.varAccountGroup = event.data.GLCODE;
     this.varcreditPeriod = event.data.CREDITPERIOD;
     this.varAccountGroupName = event.data.GLNAME;
     this.varLimit = event.data.CR_LIMIT;
     this.varCrCpr = event.data.CR_CPR;
     this.varTaxNo = event.data.TAX_1_NO;
     this.varpcode = event.data.PCODE;
     this.getCustmerParty(this.varpcode);
     this.getCustmerInvoices(this.varpcode,this.varsfyear,this.varefyear);
     this.getCustomerMember(this.varpcode)
     this.getAggrementDetails(this.varpcode)
    }
  }

  quickCustomerSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  getCustmerParty(pcode:string) {
    this.financeservice.getCustomerParty(pcode).subscribe((res: any) => {
      this.CustPartyList = res.recordset;
      console.log(this.CustPartyList);
    }, (err: any) => {
      console.log(err);
    })
  }

  getCustomerMember(pcode:string) {
    this.financeservice.getCustomerMemner(pcode).subscribe((res: any) => {
      this.CustMemberList = res.recordset;
      console.log(this.CustMemberList);
    }, (err: any) => {
      console.log(err);
    })
  }
  
  getAccountsCategoryData() {
    this.financeservice.getAccountsCategory().subscribe((res: any) =>  {
      this.AccountsCategoryList=res.recordset;
      console.log(this.AccountsCategoryList);
    }, (error: any) => {
      console.log(error);
    });
  }

  getAccountsTypeData() {
    this.financeservice.getAccountsType().subscribe((res: any) =>  {
      this.AccountsTypeList=res.recordset;
      console.log(this.AccountsTypeList);
    }, (error: any) => {
      console.log(error);
    }); 
  }
  
  getCustmerInvoices(pcode: string,sfyear: string,efyear: string) {
    this.financeservice.getCustomerInvoices(pcode, sfyear,efyear).subscribe((res: any) => {
      this.CustInvoiceList = res.recordset;
      console.log(this.CustInvoiceList);
      /*this.varInvChartLabels = [];
      this.varInvChartValues = [];
      for(let i=0; i<this.CustInvoiceList.length; i++) {
        var tempChartLbl: string = this.CustInvoiceList[i].INV_NO;
        var tempChartVal: number = this.CustInvoiceList[i].INV_AMOUNT;
        this.varInvChartLabels.push(tempChartLbl);
        this.varInvChartValues.push(tempChartVal);
      }
      console.log(this.varInvChartLabels);
      console.log(this.varInvChartValues);*/
    }, (err: any) => {
      console.log(err);
    })
  }

  getAggrementDetails(pcode: string) {
    this.financeservice.getAggrementDetails(pcode).subscribe((res: any) => {
      this.CustAgreementList = res.recordset;
      console.log(this.CustAgreementList);
    }, (err: any) => {
      console.log(err);
    })
  }
  
  ngOnInit(): void {
    this.getAccountsCategoryData();
    this.getAccountsTypeData();
  }
  
  flipChartGrid() {
    this.opbalChartBool = !this.opbalChartBool;
  }

  

}
