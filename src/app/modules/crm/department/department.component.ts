import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { GridOptions } from 'ag-grid-community';
import { CrmService } from 'src/app/services/crm/crm.service';
import { FinanceService } from 'src/app/services/finance/finance.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  DepartMentForm: FormGroup;
  @ViewChild('DeptLookUpDailouge') DeptLookUpDailouge!: TemplateRef<any>;
  @ViewChild('CostCenterLookUpDailouge') CostCenterLookUpDailouge!: TemplateRef<any>;
  @ViewChild('opbalLookupDialog') opbalLookupDialog!: TemplateRef<any>;


  deptArr: any[] = [];  
  mDeptid: any;
  costArr: any[] = [];
  opbalArr: any[] = [];
  gridApi: any;
  gridColumnApi:any;
  DepartmentList: any[] = [];
  searchValue: any;

  CostIndex: number = 0;
  opbalIndex: number = 0;
  columnDepartmentDefs: any;

  selectedRowIndex: any = 0;
  myear = '2021';
  mcompcode = '01'
  gridOptions!: Partial<GridOptions>;
  rowStyle!: { background: string; };

  utc = new Date();
  mCurDate = this.formatDate(this.utc);


  CostCenterDisplayedColumns: string[] = ['costid', 'costcode', 'costname'];
  CostCenterDataSource = new MatTableDataSource(this.costArr);

  opbalDisplayedColumns: string[] = ['pcode', 'name', 'glcode', 'opbal'];
  opbalDataSource = new MatTableDataSource(this.opbalArr);

  deptDisplayedColumns: string[] = ['deptid','deptname','prefix'];
  deptDataSource = new MatTableDataSource(this.deptArr);

  constructor(private financeservice: FinanceService, private dailog: MatDialog,private crmservice: CrmService,private snackBar:MatSnackBar) {
      this.DepartMentForm = new FormGroup({
        dptPrefix : new FormControl('' , []),
        dptName : new FormControl('' , []),
        dptLastSerial : new FormControl('' , []),
        dptActive: new FormControl('', []),
        dptType: new FormControl('', []),
        dptItemArry: new FormArray([])
      });
      this.columnDepartmentDefs = [
        { 
          headername: "Department Id",
          sortable: true ,
          field: "DEPT_ID", rowGroup: true,
          width: 200
        },
        { 
          headerName: "Department CODE", 
          field: 'PREFIX', 
          width:300, 
          suppressMenu: false, 
          unSortIcon: true,
          sortable: true, 
          tooltipField: "EXP_DESC", 
          headerTooltip: "EXP_DESC" 
        },
        { 
          headerName: "Department Name", 
          field: 'DEPT_NAME', 
          width:200, 
          suppressMenu: false, 
          unSortIcon: true,
          sortable: true, 
          tooltipField: "GL_CODE_AFFECTED", 
          headerTooltip: "GL_CODE_AFFECTED"
        }
      ]
   }

   addDeptItem() {
      const DepartmentGrid = new FormGroup({
        dptCostCenter: new FormControl('', [ Validators.required]),
        dptDescription: new FormControl('', [ Validators.required]),
        dptAccode: new FormControl('', [ Validators.required]),
        dptAccName: new FormControl('', [ Validators.required])
      });
      this.dptItems.push(DepartmentGrid);
    // }
  }

  lookupCostCenter(value: string, type: string, index: number) {
    this.selectedRowIndex = 0;
    let dialogRef = this.dailog.open(this.CostCenterLookUpDailouge);
    if (type === "cost") {
      this.crmservice.searchExpenseMaster(value).subscribe((res: any)=> {
        this.costArr = res.recordset;
        this.CostCenterDataSource = new MatTableDataSource(this.costArr);
        this.CostIndex = index;      
      }, (err: any) => {
        console.log(err);
      })
    } 
  }

  checkcostcenter(productCode: string, index: number) {
    this.CostIndex = index;      
    this.crmservice.getExpenseMaster(productCode).subscribe((res: any) => {
      const rowData: any = {
        dptCostCenter: res.recordset[0].EXP_CODE,
        dptDescription: res.recordset[0].EXP_DESC,
      }
      this.dptItems.at(index).patchValue(rowData);
      console.log(res);
    }, (err: any) => {
      console.log(err);
    })
  }

  selectOpbal(obj: any) {
    console.log(obj.PCODE);
    console.log(this.opbalIndex);
    this.checkopbal(obj.PCODE, this.opbalIndex);
    const rowData: any = {
      dptAccode: obj.PCODE,
      dptAccName: obj.CUST_NAME
    }
    this.dptItems.at(this.opbalIndex).patchValue(rowData);
    let dialogRef = this.dailog.closeAll();
  }


  checkopbal(productCode: string, index: number) {
    console.log(productCode);
    this.opbalIndex = index;      
    this.crmservice.getAllOpbal(productCode, this.myear).subscribe((res: any) => {
      const rowData: any = {
        dptAccode: res.recordset[0].PCODE,
        dptAccName: res.recordset[0].CUST_NAME
      }
      this.dptItems.at(index).patchValue(rowData);
      console.log(res);
    }, (err: any) => {
      console.log(err);
    })
  }

  deleteDeptItem(index: number) {
    if(this.dptItems.length === 1){
      console.log(this.dptItems)
    } else {
      this.dptItems.removeAt(index);
    }
    //this.siItem.last.nativeElement.focus();
  }

  highlight(type: string, index: number){
    if (type === "dept") {
      if(index >= 0 && index <= this.deptArr.length - 1)
      this.selectedRowIndex = index;
    }else if (type === "cost") {
      if(index >= 0 && index <= this.costArr.length - 1)
      this.selectedRowIndex = index;
    }else if (type === "opbal") {
      if(index >= 0 && index <= this.opbalArr.length - 1)
      this.selectedRowIndex = index;
    }
  }

  selectCost(obj: any) {
    console.log(this.CostIndex);
    this.checkcostcenter(obj.EXP_CODE, this.CostIndex);
    const rowData: any = {
      dptCostCenter: obj.EXP_CODE,
      dptDescription:obj.EXP_DESC,
    }       
    this.dptItems.at(this.CostIndex).patchValue(rowData);
    let dialogRef = this.dailog.closeAll();
  }

  onFormSubmit(){
    const data = this.DepartMentForm.value;
    console.log(data);
    this.financeservice.getnotofDepartmentMaster(data.dptPrefix).subscribe((res:any)=>{
      var rcvDatadeptarr: any[] = [];
        for(let i=0; i<data.dptItemArry.length; i++) {
          console.log(data.dptItemArry[i]);
          const val = {
            accode: data.dptItemArry[i].dptAccode,
            costcode: data.dptItemArry[i].dptCostCenter
          }
          if(rcvDatadeptarr.length === 0) {
            rcvDatadeptarr.push(val);
          } else {
            for(let j=0; j<rcvDatadeptarr.length; j++) {
              rcvDatadeptarr.push(val);
              break;
            }
          }
        }
        
      this.financeservice.UpdateAddeptarmentmaster(data.dptName,data.dptLastSerial,data.dptActive,data.dptType,'DBA',this.mCurDate,data.dptPrefix)
      
      this.financeservice.getnotofDepartmentMaster(data.dptPrefix).subscribe((res:any) => {
        const DPETID = res.recordset[0].DEPT_ID;
        this.financeservice.deleteDepartmentExpense(DPETID).subscribe((res:any) =>{
          console.log("deleted")
          for(let i=0; i<rcvDatadeptarr.length; i++) {
            this.crmservice.getnotofExpenseMaster(rcvDatadeptarr[i].costcode).subscribe((res:any) => {
              const costcodeS = res.recordset[0].EXP_ID;
                this.financeservice.postDeptExpenseMaster('01',DPETID,costcodeS,rcvDatadeptarr[i].accode,'DBA',this.mCurDate)
            })
          }
        })
      })
      
      this.snackBar.open(data.dptPrefix + " successfully updated", "close", {
        duration: 10000,
        verticalPosition: 'top',
        panelClass: ['sbBg']
      });
    },(err:any) =>{
      this.financeservice.getDepartmentMasterExpid().subscribe((res:any) => {
        const expid = res.recordset[0].EXPID;
        this.financeservice.postAddeptarmentmaster('01',expid,data.dptPrefix,data.dptName,data.dptLastSerial,data.dptActive,data.dptType,'DBA',this.mCurDate)
        var rcvDatadeptarr: any[] = [];
        for(let i=0; i<data.dptItemArry.length; i++) {
          console.log(data.dptItemArry[i]);
          const val = {
            accode: data.dptItemArry[i].dptAccode,
            costcode: data.dptItemArry[i].dptCostCenter
          }
          if(rcvDatadeptarr.length === 0) {
            rcvDatadeptarr.push(val);
          } else {
            for(let j=0; j<rcvDatadeptarr.length; j++) {
              rcvDatadeptarr.push(val);
              break;
            }
          } 
        }
        for(let i=0; i<rcvDatadeptarr.length; i++) {
          console.log(rcvDatadeptarr[i]);
          console.log(rcvDatadeptarr[i].accode);
          console.log(rcvDatadeptarr[i].costcode);
          this.crmservice.getnotofExpenseMaster(rcvDatadeptarr[i].costcode).subscribe((res:any) => {
            const costcodeS = res.recordset[0].EXP_ID;
            this.financeservice.postDeptExpenseMaster('01',expid,costcodeS,rcvDatadeptarr[i].accode,'DBA',this.mCurDate)

          })
        }
        this.snackBar.open(data.dptPrefix + " successfully inserted", "close", {
          duration: 10000,
          verticalPosition: 'top',
          panelClass: ['sbBg']
        });
      },(err:any) => {
        console.log(err)
      })
    })

  }

  lookupDepartmemt(value: string) {
    console.log(value)
    this.selectedRowIndex = 0;
    let dialogRef = this.dailog.open(this.DeptLookUpDailouge);    
    this.financeservice.searchDepartmentMaster(value).subscribe((res: any) => {
      this.deptArr = res.recordset;
      this.deptDataSource = new MatTableDataSource(this.deptArr);
    }, (err: any) => {
      console.log(err);
    })
  }

  

  lookupOpbal(value: string, type: string, index: number) {
    console.log(value);
    this.selectedRowIndex = 0;
    let dialogRef = this.dailog.open(this.opbalLookupDialog);
    if (type === "opbal") {
      this.crmservice.getSearchOpbal(value, this.myear).subscribe((res: any)=> {
        this.opbalArr = res.recordset;
        this.opbalDataSource = new MatTableDataSource(this.opbalArr);
        this.opbalIndex = index;      
      }, (err: any) => {
        console.log(err);
      })
    } 
  }

  onViewCellClicked(event: any){
    console.log(event.data);
    this.mDeptid = event.data.DEPT_ID 
    if (event.column.colId =="DEPT_ID" ){
      this.DepartMentForm.patchValue({
        dptPrefix : event.data.PREFIX,
        dptName : event.data.DEPT_NAME,
        dptLastSerial : event.data.LASTNO,
        dptActive: event.data.CASTACTIVE,
        dptType: event.data.EXPENSE_TYPE
      });
      this.financeservice.getDepartmentforGrid(this.myear,this.mcompcode,this.mDeptid).subscribe((res: any) => {
        const itemArr = res.recordset;
        for(let x=0; x<itemArr.length; x++) {
                const departmentGrid = new FormGroup({
                  dptCostCenter: new FormControl(itemArr[x].EXP_CODE, [Validators.required]),
                  dptDescription: new FormControl(itemArr[x].EXP_DESC, [Validators.required]),
                  dptAccode: new FormControl(itemArr[x].GLCODE, [Validators.required]),
                  dptAccName: new FormControl(itemArr[x].GL_NAME, [Validators.required])
                });
                this.dptItems.push(departmentGrid);
              }
          }, (error: any) => {
            console.log(error);
          })
      let dialogRef = this.dailog.closeAll();
    }else if (event.column.colId =="DEPT_NAME" ){
      this.DepartMentForm.patchValue({
        dptPrefix : event.data.PREFIX,
        dptName : event.data.DEPT_NAME,
        dptLastSerial : event.data.LASTNO,
        dptActive: event.data.CASTACTIVE,
        dptType: event.data.EXPENSE_TYPE
      });
      this.financeservice.getDepartmentforGrid(this.myear,this.mcompcode,this.mDeptid).subscribe((res: any) => {
        const itemArr = res.recordset;
        for(let x=0; x<itemArr.length; x++) {
                const departmentGrid = new FormGroup({
                  dptCostCenter: new FormControl(itemArr[x].EXP_CODE, [Validators.required]),
                  dptDescription: new FormControl(itemArr[x].EXP_DESC, [Validators.required]),
                  dptAccode: new FormControl(itemArr[x].GLCODE, [Validators.required]),
                  dptAccName: new FormControl(itemArr[x].GL_NAME, [Validators.required])
                });
                this.dptItems.push(departmentGrid);
              }
          }, (error: any) => {
            console.log(error);
          })
    }
  }

  onGridCostCenterReady(params: any){ 
    this.gridApi= params.api;
    this.gridColumnApi= params.columnApi;
    this.crmservice.getAllDepartmentMaster().subscribe((res: any) =>  {
      console.log(this.DepartmentList);
      this.DepartmentList=res.recordset;
      params.api.setRowData(this.DepartmentList);
      console.log(this.DepartmentList);
    }, (error: any) => {
      console.log(error);
    });
  }

  searchDepartment(deptno: any) {
    this.financeservice.searchDepartmentMaster(deptno).subscribe((res: any) => {
      this.selectDept(res.recordset[0]);
    }, (err: any) => {
      console.log(err);
    })
  }

  arrowDownEvent(type: string, index: number){
    this.highlight(type, ++index);
  }

  arrowUpEvent(type: string, index: number){
    this.highlight(type, --index);
  }

  quickCostCenterSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  selectDept(obj: any) {
    this.mDeptid = obj.DEPT_ID;
    console.log(obj.CHEQUE_BANK_NAME);
    this.dptItems.clear();
    this.DepartMentForm.patchValue({
        dptPrefix : obj.PREFIX,
        dptName : obj.DEPT_NAME,
        dptLastSerial : obj.LASTNO,
        dptActive: obj.CASTACTIVE,
        dptType: obj.EXPENSE_TYPE
    });
    this.financeservice.getDepartmentforGrid(this.myear,this.mcompcode,this.mDeptid).subscribe((res: any) => {
      const itemArr = res.recordset;
      for(let x=0; x<itemArr.length; x++) {
              const departmentGrid = new FormGroup({
                dptCostCenter: new FormControl(itemArr[x].EXP_CODE, [Validators.required]),
                dptDescription: new FormControl(itemArr[x].EXP_DESC, [Validators.required]),
                dptAccode: new FormControl(itemArr[x].GLCODE, [Validators.required]),
                dptAccName: new FormControl(itemArr[x].GL_NAME, [Validators.required])
              });
              this.dptItems.push(departmentGrid);
            }
        }, (error: any) => {
          console.log(error);
        })
    let dialogRef = this.dailog.closeAll();
  }


  get dptItems(): FormArray {
    return this.DepartMentForm.get('dptItemArry') as FormArray
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
