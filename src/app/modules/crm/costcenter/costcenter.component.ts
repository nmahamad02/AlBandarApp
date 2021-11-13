
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { GridOptions } from 'ag-grid-community';
import { ClubserivceService } from 'src/app/services/clubservice/clubserivce.service';
import { CrmService } from 'src/app/services/crm/crm.service';

@Component({
  selector: 'app-costcenter',
  templateUrl: './costcenter.component.html',
  styleUrls: ['./costcenter.component.scss']
})
export class CostcenterComponent implements OnInit {

  @ViewChild('opbalLookupDialog') opbalLookupDialog!: TemplateRef<any>;
  @ViewChild('ConfirmDialogComponent') ConfirmDialogComponent!: TemplateRef<any>;
  

  costcentreForm : FormGroup;
  columnCostCenterDefs: any;
  gridOptions!: Partial<GridOptions>;
  rowStyle!: { background: string; };
  searchValue: any;
  Bool: boolean
  gridApi: any;
  opbalIndex: number = 0;
  gridColumnApi:any;
  costcenterList: any[] = [];
  opbalArr: any[] = [];
  myear = '2021';
  utc = new Date();
  mCurDate = this.formatDate(this.utc);
  
  selectedRowIndex: any = 0;

  opbalDisplayedColumns: string[] = ['pcode', 'name', 'glcode', 'opbal'];
  opbalDataSource = new MatTableDataSource(this.opbalArr);

  constructor(private crmservices: CrmService,private dailog:MatDialog,private clubservices:ClubserivceService,private snackBar:MatSnackBar) { 
    this.costcentreForm = new FormGroup({
      expenseCode: new FormControl('', [Validators.required]),
      description: new FormControl('', []),
      glAccount: new FormControl('', []),
      glAccountCustname: new FormControl({ value: 'GL Account Name', disabled: true }),
      active: new FormControl('', [])
    })

    this.columnCostCenterDefs = [
      { 
        headername: "Expense Code",
        sortable: true ,
        field: "EXP_CODE", rowGroup: true,
        width: 200
      },
      { 
        headerName: "Description", 
        field: 'EXP_DESC', 
        width:300, 
        suppressMenu: false, 
        unSortIcon: true,
        sortable: true, 
        tooltipField: "EXP_DESC", 
        headerTooltip: "EXP_DESC" 
      },
      { 
        headerName: "GL-Code", 
        field: 'GL_CODE_AFFECTED', 
        width:200, 
        suppressMenu: false, 
        unSortIcon: true,
        sortable: true, 
        tooltipField: "GL_CODE_AFFECTED", 
        headerTooltip: "GL_CODE_AFFECTED"
      }
    ]
  }

  quickCostCenterSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  newForm(){
    this.costcentreForm = new FormGroup({
      expenseCode: new FormControl('', [Validators.required]),
      description: new FormControl('', []),
      glAccount: new FormControl('', []),
      glAccountCustname: new FormControl({ value: 'GL Account Name', disabled: true }),
      active: new FormControl('', [])
    })
  }

  highlight(type: string, index: number){
    if (type === "opbal") {
      if(index >= 0 && index <= this.opbalArr.length - 1)
      this.selectedRowIndex = index;
    }
  }

  arrowDownEvent(type: string, index: number){
    this.highlight(type, ++index);
  }

  arrowUpEvent(type: string, index: number){
    this.highlight(type, --index);
  }

 

  selectOpbal(obj: any) {
    console.log(obj.PCODE);
    console.log(this.opbalIndex);
    this.checkopbal(obj.PCODE, this.opbalIndex);
    let dialogRef = this.dailog.closeAll();
  }

  checkopbal(productCode: string, index: number) {
    this.opbalIndex = index;      
    const data = this.costcentreForm.value;
    this.crmservices.getAllOpbal(productCode, this.myear).subscribe((res: any) => {
      this.costcentreForm.patchValue({
        glAccount: res.recordset[0].PCODE,
        glAccountCustname: res.recordset[0].CUST_NAME
      })
      console.log(res);
    }, (err: any) => {
      console.log(err);
    })
  }

  lookUpDebitAcc(value: string) {
    console.log(value);
    this.selectedRowIndex = 0;
    let dialogRef = this.dailog.open(this.opbalLookupDialog);    
    this.crmservices.getPcode(value,this.myear).subscribe((res: any) => {
      this.opbalArr = res.recordset;
      this.opbalDataSource = new MatTableDataSource(this.opbalArr);
    }, (err: any) => {
      console.log(err);
    })
  }

  searchDebitAccount(pcode: any) {
    this.crmservices.searchpcode(pcode).subscribe((res: any) => {
      this.selectOpbal(res.recordset[0]);
    }, (err: any) => {
      console.log(err);
    })
  }

  onGridCostCenterReady(params: any){ 
    this.gridApi= params.api;
    this.gridColumnApi= params.columnApi;
    this.crmservices.getAllExpenseforGrid().subscribe((res: any) =>  {
      console.log(this.costcenterList);
      this.costcenterList=res.recordset;
      params.api.setRowData(this.costcenterList);
      console.log(this.costcenterList);
    }, (error: any) => {
      console.log(error);
    });
  }
  
  onViewCellClicked(event: any){
    console.log(event.data);
    if (event.column.colId =="EXP_DESC" ){
      this.costcentreForm.patchValue({
        expenseCode: event.data.EXP_CODE,
        description: event.data.EXP_DESC,
        glAccount: event.data.GL_CODE_AFFECTED,
        glAccountCustname: event.data.CUST_NAME,
        active: event.data.CASTACTIVE,
      });
    }else if (event.column.colId =="EXP_CODE" ){
      this.costcentreForm.patchValue({
        expenseCode: event.data.EXP_CODE,
        description: event.data.EXP_DESC,
        glAccount: event.data.GL_CODE_AFFECTED,
        glAccountCustname: event.data.CUST_NAME,
        active: event.data.CASTACTIVE,
        
      });
    }
  }
  
submitForm() {
  const data = this.costcentreForm.value;
  console.log(data);
  this.crmservices.getnotofExpenseMaster(data.expenseCode).subscribe((res:any) => {
    this.crmservices.UpdateExpenseMaster(data.description,data.glAccount,data.active,'DBA',this.mCurDate,data.expenseCode).subscribe((res: any)=>{
      console.log(res);
    },(err: any) =>{
      console.log(err);
    })
    this.snackBar.open(data.expenseCode + " successfully Updated", "close", {
      duration: 10000,
      verticalPosition: 'top',
      panelClass: ['sbBg']
    });
  },(err:any) => {
    this.crmservices.getExpenseMasterExpid().subscribe((res:any) => {
      const expid = res.recordset[0].EXPID;
      this.crmservices.postExpenseMaster('01',expid,data.expenseCode,data.description,data.glAccount,data.active,'DBA',this.mCurDate).subscribe((res:any) => {
        console.log(res);
        this.snackBar.open(data.expenseCode + " successfully inserted", "close", {
          duration: 10000,
          verticalPosition: 'top',
          panelClass: ['sbBg']
        });
      },(err:any) => {
        console.log(err);
      })
    })
  })
  
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

  ngOnInit(): void {
  }

}
