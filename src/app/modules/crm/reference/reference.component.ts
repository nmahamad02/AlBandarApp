
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { concat } from 'rxjs';
import { CrmService } from 'src/app/services/crm/crm.service';
import { FinanceService } from 'src/app/services/finance/finance.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';


@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss']
})
export class ReferenceComponent implements OnInit {
  referenceForm: FormGroup
  searchValue: any;
  gridOptions!: Partial<GridOptions>;
  columnDefs:any;
  gridApi: any;
  gridColumnApi:any;
  refList: any[] = [];
  mRefDetails: any;
  rowStyle!: { background: string; };
  varPcode: string = ""
  varRefType: string = ""
  varRefName: string = ""
  varRefDescription: string = ""
  refArr: any[] = [];
  utc = new Date();

  mCurDate = this.formatDate(this.utc);
  constructor(private crmservices:CrmService,private lookupservice:LookupService,private financeservice: FinanceService) { 
    this.referenceForm = new FormGroup({
      referenceType: new FormControl('', []),
      referenceCode: new FormControl('', [Validators.required]),
      referenceName: new FormControl('', [Validators.required]),
      referenceDescription: new FormControl('', []),
    })
    this.columnDefs = [
      { 
        headername: "REFERENCE CODE",
        sortable: true ,
        field: "PCODE",
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
        headername: "DESCRIPTION",
        field: "DESCRIPTION",
        filter: true,
        rowGroup:true,
        enableRowGroup: true,
        width:300
      },
      { 
        headername: "TYPE",
        filter: true,
        sortable: true,
        field: "TYPE",
        width:75
      }
    ]
  }

  ngOnInit(): void {
    this.getRefTypeData()
  }

  onGridRefDetails(params: any){ 
    this.gridApi= params.api;
    this.gridColumnApi= params.columnApi;
    this.crmservices.getReference().subscribe((res: any) =>  {
      console.log(this.refList);
      this.refList=res.recordset;
      params.api.setRowData(this.refList);
      console.log(this.refList);
    }, (error: any) => {
      console.log(error);
    });
  }

  newForm(){
    this.referenceForm = new FormGroup({
      referenceType: new FormControl('', []),
      referenceCode: new FormControl('', [Validators.required]),
      referenceName: new FormControl('', [Validators.required]),
      referenceDescription: new FormControl('', []),
    })
  }

  onViewCellClicked(event: any){
    console.log(event.data);
    if (event.column.colId =="NAME" ) // only first column clicked
    {
      this.referenceForm.patchValue({
        referenceType: event.data.TYPE,
        referenceCode: event.data.PCODE,
        referenceName: event.data.NAME,
        referenceDescription: event.data.DESCRIPTION
      });
    }
  }

  getRefTypeData(){
    this.lookupservice.getAllRef().subscribe((res: any)=>{  
        this.refArr = res.recordset
    }, (err: any) =>{
        console.log(err)
    });  
  }


  getRefData(refNO:string) {
    this.crmservices.getReferenceCode(refNO).subscribe((res: any) => {
      this.mRefDetails = res.recordset[0];
      console.log(this.mRefDetails);
    }, (err: any) => {
      console.log(err);
    })
  }

  quickReferenceSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  submitForm() {
    const data = this.referenceForm.value;
    console.log(data);
    this.lookupservice.getRefcode(data.referenceCode).subscribe((res:any) =>{
      console.log(res.recordset);
      this.financeservice.updateReferenceData(data.referenceName,data.referenceDescription,data.referenceType,'01','1','DBA',this.mCurDate,data.referenceCode)
    },(err: any) =>{
      console.log(err);
      this.financeservice.getMaxOfRef().subscribe((res:any) => {
        const recid = res.recordset[0].RECID
        console.log(recid)
        this.financeservice.postReferenceData(recid,data.referenceCode,data.referenceName,data.referenceDescription,data.referenceType,'01','1','DBA',this.mCurDate)
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

}
