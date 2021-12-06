import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridOptions } from 'ag-grid-community';
//import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
//import { Color, Label } from 'ng2-charts';
import * as moment from 'moment';
import { FinanceService } from 'src/app/services/finance/finance.service';
import * as ExcelJS from  'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';
const EXCEL_EXTENSION = '.xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

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
  BranchArr: any[] = [];
  custExcelArr: any[] = [];
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
  
  columns: any[];

  

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

  constructor(private financeservice:FinanceService,private snackbar:MatSnackBar,private dataSharing: DataSharingService){ 
    this.custForm = new FormGroup({
      pcode: new FormControl('', [ Validators.required]),
      cname: new FormControl('', [ Validators.required]),
      cStatus: new FormControl('', [ Validators.required]),
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

    this.columns = ["Customer Code","Customer Name","Account Type","Account Category","Branch Name","GL Code","GL Name","CPR Number","Limit","TAX No"];

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
      this.customerlist=res.recordset;
      params.api.setRowData(this.customerlist);
    }, (error: any) => {
      console.log(error);
    });
  }

  newForm() {
    this.custForm = new FormGroup({
      pcode: new FormControl('', [ Validators.required]),
      cname: new FormControl('', [ Validators.required]),
      cStatus: new FormControl('', [ Validators.required]),
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
  }

  refreshForm(){
    this.custForm = new FormGroup({
      pcode: new FormControl('', [ Validators.required]),
      cname: new FormControl('', [ Validators.required]),
      cStatus: new FormControl('', [ Validators.required]),
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
  }

  onGridCustomerParty(params: any){ 
    this.gridApiCust= params.api;
    this.gridColumnApiCust= params.columnApi;
    this.financeservice.getCustomerParty(this.varpcode).subscribe((res: any) => {
      this.CustPartyList = res.recordset;
      params.api.setRowData(this.CustPartyList);
    }, (err: any) => {
      console.log(err);
    })
  }

  getCustmerDetails(pcode: any){
    this.financeservice.getCustomerBypcode(pcode).subscribe((res:any) => {
      this.selectCustomer(res.recordset[0])
    },(err: any)=>{
      console.log(err);
    })
  }

  selectCustomer(data: any){
    this.custForm.patchValue({
      pcode: data.PCODE,
      cname: data.CUST_NAME,
      cStatus: data.STATUS,
      cAccountCategory: data.ACCOUNT_CATEGORY_CD,
      cAccountGroup: data.GLCODE,
      CAccountGroupName: data.GLNAME,
      cType: data.ACCOUNT_TYPE_CD,
      cBranch: data.BRANCH_ID,
      cExternalCode: data.AFFECTING_TYPE_CODE,
      cCreditPeriod: data.CREDITPERIOD,
      cLimit: data.CR_LIMIT,
      cCR: data.CR_CPR,
      cTaxNo: data.TAX_1_NO  
    });
    this.varpcode = data.PCODE;
    this.getCustmerParty(this.varpcode);
    this.getCustmerInvoices(this.varpcode,this.varsfyear,this.varefyear);
    this.getCustomerMember(this.varpcode)
    this.getAggrementDetails(this.varpcode)
    this.onGridCustomerMember(this.CustMemberList)
  }

  onGridCustomerMember(params: any){ 
    this.gridApiCust= params.api;
    this.gridColumnApiCust= params.columnApi;
    this.financeservice.getCustomerMemner(this.varpcode).subscribe((res: any) =>  {
      this.CustMemberList=res.recordset;
      params.api.setRowData(this.CustMemberList);
    }, (error: any) => {
      console.log(error);
    });
  }

  onGridCustomerAgreement(params: any){ 
    this.gridApiCust= params.api;
    this.gridColumnApiCust= params.columnApi;
    this.financeservice.getCustomerMemner(this.varpcode).subscribe((res: any) =>  {
      this.CustAgreementList=res.recordset;
      params.api.setRowData(this.CustAgreementList);
    }, (error: any) => {
      console.log(error);
    });
  }

  onGridCustomerOpeningDetail(params: any){ 
    this.gridApiCust= params.api;
    this.gridColumnApiCust= params.columnApi;
    this.financeservice.getCustomerInvoices(this.varpcode, this.varsfyear, this.varefyear).subscribe((res: any) => {
      this.CustInvoiceList = res.recordset;
      params.api.setRowData(this.CustInvoiceList);
      /*for(let i=0; i<this.CustInvoiceList.length; i++) {
        var tempChartLbl: string = this.CustInvoiceList[i].INV_NO;
        var tempChartVal: number = this.CustInvoiceList[i].INV_AMOUNT;
        this.varInvChartLabels.push(tempChartLbl);
        this.varInvChartValues.push(tempChartVal);
      }*/
    }, (err: any) => {
      console.log(err);
    })
  }


  onViewCellClicked(event: any){
    if (event.column.colId =="CUST_NAME" ){
      this.custForm.patchValue({
        pcode: event.data.PCODE,
        cname: event.data.CUST_NAME,
        cStatus: event.data.STATUS,
        cAccountCategory: event.data.ACCOUNT_CATEGORY_CD,
        cAccountGroup: event.data.GLCODE,
        CAccountGroupName: event.data.GLNAME,
        cType: event.data.ACCOUNT_TYPE_CD,
        cBranch: event.data.BRANCH_ID,
        cExternalCode: event.data.AFFECTING_TYPE_CODE,
        cCreditPeriod: event.data.CREDITPERIOD,
        cLimit: event.data.CR_LIMIT,
        cCR: event.data.CR_CPR,
        cTaxNo: event.data.TAX_1_NO
        
      });
      this.varpcode = event.data.PCODE;
      this.getCustmerParty(this.varpcode);
      this.getCustmerInvoices(this.varpcode,this.varsfyear,this.varefyear);
      this.getCustomerMember(this.varpcode)
      this.getAggrementDetails(this.varpcode)
    }
  }

  submitForm(){
    const data = this.custForm.value
    if (data.pcode == ''){
      this.snackbar.open("Please Enter Pcode", "close", {
        duration: 10000,
        verticalPosition: 'top',
        panelClass: ['sbBg']
      });
    }
    else{
      this.financeservice.getCustomerBypcode(data.pcode).subscribe((res: any) => {
        this.financeservice.updateOPbalDeatils(data.cname,data.cAccountCategory,data.cAccountGroup,data.cType,data.cBranch,data.cExternalCode,data.cCreditPeriod,data.cLimit,data.cCR,data.cTaxNo,data.pcode)
        this.snackbar.open(data.pcode + " Updated Successfully", "close", {
          duration: 10000,
          verticalPosition: 'top',
          panelClass: ['sbBg']
        });
      },(err:any) =>{
        this.financeservice.postOpbalDetails('01',data.pcode,data.cname,data.cAccountCategory,data.cAccountGroup,data.cType,data.cBranch,data.cExternalCode,data.cCreditPeriod,data.cLimit,data.cCR,data.cTaxNo,'2021')
        this.snackbar.open( data.pcode + " inserted Successfully", "close", {
          duration: 10000,
          verticalPosition: 'top',
          panelClass: ['sbBg']
        });
      })
      
    }
    
  }

  quickCustomerSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  getCustmerParty(pcode:string) {
    this.financeservice.getCustomerParty(pcode).subscribe((res: any) => {
      this.CustPartyList = res.recordset;
    }, (err: any) => {
      console.log(err);
    })
  }

  getCustomerMember(pcode:string) {
    this.financeservice.getCustomerMemner(pcode).subscribe((res: any) => {
      this.CustMemberList = res.recordset;
    }, (err: any) => {
      console.log(err);
    })
  }
  
  getAccountsCategoryData() {
    this.financeservice.getAccountsCategory().subscribe((res: any) =>  {
      this.AccountsCategoryList=res.recordset;
    }, (error: any) => {
      console.log(error);
    });
  }

  getAccountsTypeData() {
    this.financeservice.getAccountsType().subscribe((res: any) =>  {
      this.AccountsTypeList=res.recordset;
    }, (error: any) => {
      console.log(error);
    }); 
  }

  getBranchData() {
    this.financeservice.getBranch().subscribe((res: any) =>  {
      this.BranchArr=res.recordset;
    }, (error: any) => {
      console.log(error);
    }); 
  }
  
  getCustmerInvoices(pcode: string,sfyear: string,efyear: string) {
    this.financeservice.getCustomerInvoices(pcode, sfyear,efyear).subscribe((res: any) => {
      this.CustInvoiceList = res.recordset;
      /*this.varInvChartLabels = [];
      this.varInvChartValues = [];
      for(let i=0; i<this.CustInvoiceList.length; i++) {
        var tempChartLbl: string = this.CustInvoiceList[i].INV_NO;
        var tempChartVal: number = this.CustInvoiceList[i].INV_AMOUNT;
        this.varInvChartLabels.push(tempChartLbl);
        this.varInvChartValues.push(tempChartVal);
      }*/
    }, (err: any) => {
      console.log(err);
    })
  }

 
  getAggrementDetails(pcode: string) {
    this.financeservice.getAggrementDetails(pcode).subscribe((res: any) => {
      this.CustAgreementList = res.recordset;
    }, (err: any) => {
      console.log(err);
    })
  }
  
  getCustomerExcel(){
    this.financeservice.getCustomerForExcel().subscribe((res:any) => {
      this.custExcelArr = res.recordset
      console.log(res.recordset)
    },(err: any) =>{
      console.log(err)
    })
  }

  public exportAsExcelFile(
    reportHeading: string,
    reportSubheading: string,
    headerArray: any[],
    excelfileName: string,
    sheetname:string
    
    ) {
      const data = this.custExcelArr;
      const header = headerArray;
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'ifasoft';
      workbook.lastModifiedBy = 'ifasoft';
      workbook.created = new Date();
      workbook.modified = new Date();
      const worksheet = workbook.addWorksheet(sheetname);

      worksheet.addRow([]);
      worksheet.mergeCells('A1:' + this.numToAlpha(header.length - 1) + '1');
      worksheet.getCell('A1').value = reportHeading;
      worksheet.getCell('A1').alignment = {horizontal: 'center'};
      worksheet.getCell('A1').font = {name:'Times New Roman',size:20 ,bold:false};

      if (reportSubheading !== ''){
        worksheet.addRow([]);
      worksheet.mergeCells('A2:' + this.numToAlpha(header.length - 1) + '2');
      worksheet.getCell('A2').value = reportSubheading;
      worksheet.getCell('A2').alignment = {horizontal: 'center'};
      worksheet.getCell('A2').font = {size:14 ,bold:false};
      
      }

      worksheet.addRow([]);

      const HeaderRow = worksheet.addRow(header);

      HeaderRow.eachCell((cell,index) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF00'},
          bgColor: { argb: 'FF0000FF'}
        };
        cell.border = {top: {style: 'thin'},left: {style: 'thin'},bottom: {style: 'thin'},right: {style: 'thin'}};
        cell.font = {name: 'Times New Roman', size: 12, bold: false};
        cell.alignment = {horizontal: 'center'};
        worksheet.getColumn(1).width = 15;
        worksheet.getColumn(2).width = 40;
        worksheet.getColumn(3).width = 22;
        worksheet.getColumn(4).width = 15;
        worksheet.getColumn(5).width = 32;
        worksheet.getColumn(6).width = 32;
        worksheet.getColumn(7).width = 32;
        worksheet.getColumn(8).width = 36;
        worksheet.getColumn(9).width = 21;
        worksheet.getColumn(10).width = 21;
        // worksheet.getColumn(index).width = header[index - 1].length < 20 ? 20 : header[index - 1].length;

      });

      let columnsArray: any[];
      for (const key in this.custExcelArr){
        if(this.custExcelArr.hasOwnProperty(key)){
          columnsArray = Object.keys(this.custExcelArr[key]);
        }
      }

      data.forEach((element: any) => {
        const eachrow = [];
        columnsArray.forEach((column) => {
          eachrow.push(element[column]);
        });

        if(element.isDeleted === 'Y'){
          const deleteRow = worksheet.addRow(eachrow);
          deleteRow.eachCell((cell) => {
            cell.font = {name: 'Times New Roman', family: 4, size:11, bold: false, strike: true};
          });
        } else {
          worksheet.addRow(eachrow);
        }
      });

      workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
        const blob = new Blob([data], {type: EXCEL_TYPE});
        FileSaver.saveAs(blob, excelfileName + EXCEL_EXTENSION);
      })
  }


  numToAlpha(num: number) {
    let alpha = '';
    for (; num >=0; num = parseInt((num / 26).toString(),10)-1){
      alpha = String.fromCharCode(num %  26 + 0x41) + alpha;
    }
    return alpha;
  }
  
  setReportData(apiUrl: string, reportType: string){
    const reportData = {
      apiUrl: apiUrl,
      reportType: reportType
    };
    this.dataSharing.setData(reportData);
  }

  exportTOexcel(){
    this.exportAsExcelFile('AL Bander Hotel & Resort','All Customer List',this.columns,'Customer-Report','sheet1')
  }

  ngOnInit(): void {
    this.getAccountsCategoryData();
    this.getAccountsTypeData();
    this.getBranchData();
    this.getCustomerExcel();
  }
  
  flipChartGrid() {
    this.opbalChartBool = !this.opbalChartBool;
  }
}
