
import { TemplateRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { GridOptions } from 'ag-grid-community';
import { ClubserivceService } from 'src/app/services/clubservice/clubserivce.service';
import { CrmService } from 'src/app/services/crm/crm.service';
import { FinanceService } from 'src/app/services/finance/finance.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  
  @ViewChild('sivLookupDialog') sivLookupDialog!: TemplateRef<any>;

  servicesForm: FormGroup
  gridOptions!: Partial<GridOptions>;
  mSrvNo = '';
  srvArr: any[] = [];
  selectedRowIndex: any = 0;
  gridApi: any;
  gridColumnApi:any;
  serviceList: any[] = [];
  columnServicedefs : any;
  rowStyle!: { background: string; };
  searchValue: any;
  TaxCatergoryList: any[] = [];
  DepartmentList: any[] = [];
  CostandGlcodeList: any[] = [];
  utc = new Date();
  mCurDate = this.formatDate(this.utc);

  serviceDisplayedColumns: string[] = ['ServiceID', 'servicedesc', 'actualprice', 'memberprice'];
  serviceDataSouuce = new MatTableDataSource(this.srvArr);

  varServiceid: string = "";
  varServiceName: string = "";
  VarSericeCategory: string = "";
  varServiceDescription: string = "";
  varFeeCategory: string = "";
  varActualPrice: string = "";
  VarDiscountPrice: string = "";
  varTaxCategory: string = "";
  varMemberPrice: string = "";
  varDepartment: string = "";
  varCostcenter: string = "";
  varGlcode: string = "";
  
  constructor(private financneserive:FinanceService, private dialog: MatDialog,private crmservice: CrmService,private clubservices: ClubserivceService,private snackBar: MatSnackBar) {
    this.servicesForm = new FormGroup({
      serviceId: new FormControl('', [Validators.required]),
      serviceCategory: new FormControl('', []),
      feeCategory: new FormControl('', []),
      TaxCategory: new FormControl('', []),
      serviceName: new FormControl('', []),
      serviceDescription: new FormControl('', []),
      actualPrice: new FormControl('', []),
      discountPrice: new FormControl('', []),
      memberPrice: new FormControl('', []),
      department: new FormControl('',[]),
      costcenter: new FormControl('',[]), 
      glcode: new FormControl('',[])
    });

    this.columnServicedefs = [
      { 
        headername: "Service ID",
        sortable: true,
        field: "ServiceID",
        width: 85
      },
      { 
        headerName: "Service Description", 
        field: 'ServiceDescription', 
        width:250, 
        suppressMenu: false, 
        unSortIcon: true,
        sortable: true,
        tooltipField: "ServiceDescription", 
        headerTooltip: "ServiceDescription" 
      },
      { 
        headername: "Actul Price",
        field: "ActualPrice",
        filter: true,
        rowGroup:true,
        enableRowGroup: true,
        width:75
      },
      { 
        headername: "Discount Price",
        filter: true,
        sortable: true,
        field: "DiscountPrice",
        width:150,
        rowGroup:true
      },
      { 
        headername: "Member Price",
        filter: true,
        sortable: true,
        field: "MemberPrice",
        width:150
      },

    ];
    
   }

  ngOnInit(): void {
    this.getTaxcatergoryListdata()
    this.getDepartmentListData()
  }

  lookUpSrv(value: string) {
    this.selectedRowIndex = 0;
    let dialogRef = this.dialog.open(this.sivLookupDialog);    
    this.financneserive.getServiceDetails(value).subscribe((res: any) => {
      this.srvArr = res.recordset;
      this.serviceDataSouuce = new MatTableDataSource(this.srvArr);
    }, (err: any) => {
      console.log(err);
    })
  }

  highlight(type: string, index: number){
    if(type === "srvs"){
      if(index >= 0 && index <= this.srvArr.length - 1)
      this.selectedRowIndex = index;
    } 
  }

  newForm(){
    this.servicesForm = new FormGroup({
      serviceId: new FormControl('***NEW***', [Validators.required]),
      serviceCategory: new FormControl('', []),
      feeCategory: new FormControl('', []),
      TaxCategory: new FormControl('', []),
      serviceName: new FormControl('', []),
      serviceDescription: new FormControl('', []),
      actualPrice: new FormControl('', []),
      discountPrice: new FormControl('', []),
      memberPrice: new FormControl('', []),
      department: new FormControl('',[]),
      costcenter: new FormControl('',[]), 
      glcode: new FormControl('',[])
    });
  }
  
  getTaxcatergoryListdata() {
    this.financneserive.getAllTaxCategoryData().subscribe((res: any) =>  {
      this.TaxCatergoryList=res.recordset;
      console.log(this.TaxCatergoryList);
    }, (error: any) => {
      console.log(error);
    }); 
  }

  getDepartmentListData() {
    this.crmservice.getAllDepartmentMaster().subscribe((res: any) =>  {
      this.DepartmentList=res.recordset;
      console.log(this.DepartmentList);
    }, (error: any) => {
      console.log(error);
    }); 
  }

  searchSiv(srvno: any) {
    this.financneserive.getServiceDetails(srvno).subscribe((res: any) => {
      this.selectSiv(res.recordset[0]);
    }, (err: any) => {
      console.log(err);
    })
  }

  OnSelected(){
    console.log(this.varDepartment)
    this.financneserive.getAllDepartmentExpensesforDP(this.varDepartment).subscribe((res:any) => {
      this.CostandGlcodeList = res.recordset;
      console.log(this.CostandGlcodeList)
    },(err: any) => {
      console.log(err);
    })
  }
  

  selectSiv(obj: any) {
    this.mSrvNo = obj.ServiceID;
    // this.siItems.clear();
    // const date = this.formatDate(obj.TRN_DATE);
    this.servicesForm.patchValue({
      serviceId: obj.ServiceID,
      serviceCategory:obj.ServiceCategory,
      feeCategory: obj.ServiceGroup,
      serviceName: obj.ServiceName,
      serviceDescription: obj.ServiceDescription,
      actualPrice: obj.ActualPrice,
      discountPrice: obj.DiscountPrice,
      memberPrice: obj.MemberPrice
    });
    let dialogRef = this.dialog.closeAll();
  }

  arrowUpEvent(type: string, index: number){
    this.highlight(type, --index);
   }
 
   arrowDownEvent(type: string, index: number){
     this.highlight(type, ++index);
   }
  
   onGridServiceReady(params: any){ 
    this.gridApi= params.api;
    this.gridColumnApi= params.columnApi;
    this.financneserive.getAllService().subscribe((res: any) =>  {
      console.log(this.serviceList);
      this.serviceList=res.recordset;
      params.api.setRowData(this.serviceList);
      console.log(this.serviceList);
    }, (error: any) => {
      console.log(error);
    });
  }


  onViewCellClicked(event: any){
    console.log(event.data);
    if (event.column.colId =="ServiceDescription" ){
     this.varServiceid = event.data.ServiceID;
     this.VarSericeCategory= event.data.ServiceCategory;
     this.varServiceName= event.data.ServiceName;
     this.varFeeCategory = event.data.serviceDescription;
     this.varServiceDescription = event.data.serviceDescription;
     this.varTaxCategory = event.data.TaxCategory
     this.varActualPrice = event.data.ActualPrice;
     this.VarDiscountPrice = event.data.DiscountPrice;
     this.varMemberPrice = event.data.MemberPrice;
     this.varDepartment = event.data.DEPT_ID,
     this.varCostcenter = event.data.EXP_ID,
     this.varGlcode = event.data.PCODE
    }
  }
  quickSeriveSearch() { 
    this.gridApi.setQuickFilter(this.searchValue);
  }

  submitForm() {
    const data = this.servicesForm.value;
    console.log(data);
    console.log(this.varServiceName);
    console.log(this.varGlcode);
    console.log(this.varServiceid)
    if(data.serviceId == '***NEW***'){
      this.clubservices.getMaxofService().subscribe((res: any) =>{
        const serivceid = res.recordset[0].serviceid;
        this.clubservices.postServiceMaster(data.serviceName,data.serviceDescription,data.actualPrice,data.discountPrice,data.memberPrice,this.mCurDate,
        '0',data.serviceCategory,data.TaxCategory,data.department,data.costcenter,data.glcode)
        this.snackBar.open(serivceid + " successfully Inserted", "close", {
          duration: 10000,
          verticalPosition: 'top',
          panelClass: ['sbBg']
        });
      })
    }else{
      this.clubservices.updateserviceMaster(data.serviceName,data.serviceDescription,data.actualPrice,data.discountPrice,
        data.memberPrice,this.mCurDate,'0',data.serviceCategory,data.TaxCategory,data.department,data.costcenter,data.glcode,this.varServiceid)
        this.snackBar.open(data.serviceId + " successfully Updated", "close", {
          duration: 10000,
          verticalPosition: 'top',
          panelClass: ['sbBg']
        });
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

}
