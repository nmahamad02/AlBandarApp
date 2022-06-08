
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { CrmService } from 'src/app/services/crm/crm.service';
import { FinanceService } from 'src/app/services/finance/finance.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';


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
  rowStyle!: { background: string; };
  varPcode: string = ""
  varRefType: string = ""
  varRefName: string = ""
  varRefDescription: string = ""
  refArr: any[] = [];
  utc = new Date();

  mCurDate = this.formatDate(this.utc);
  constructor(private crmservices: CrmService, public snackbar: MatSnackBar, private lookupservice: LookupService, private financeservice: FinanceService, private route: ActivatedRoute ) {
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
    this.getRefTypeData();
    this.getRefData(this.route.snapshot.params.id);
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
    this.lookupservice.getRefcode(refNO).subscribe((res: any) => {
      this.selectReference(res.recordset[0])
    }, (err: any) => {
      console.log(err);
    })
  }

  selectReference(data: any) {
    this.referenceForm.patchValue({
      referenceType: data.TYPE,
      referenceCode: data.PCODE,
      referenceName: data.NAME,
      referenceDescription: data.DESCRIPTION
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
      this.financeservice.updateReferenceData(data.referenceName, data.referenceDescription, data.referenceType, '01', '1', 'DBA', this.mCurDate, data.referenceCode);
      this.snackbar.open("Updated Successfully", "close", {
        duration: 10000,
        verticalPosition: 'top',
        panelClass: ['sbBg']
      });
    },(err: any) =>{
      console.log(err);
      this.financeservice.getMaxOfRef().subscribe((res:any) => {
        const recid = res.recordset[0].RECID
        console.log(recid)
        this.financeservice.postReferenceData(recid, data.referenceCode, data.referenceName, data.referenceDescription, data.referenceType, '01', '1', 'DBA', this.mCurDate);
        this.snackbar.open("Inserted Successfully", "close", {
          duration: 10000,
          verticalPosition: 'top',
          panelClass: ['sbBg']
        });
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
