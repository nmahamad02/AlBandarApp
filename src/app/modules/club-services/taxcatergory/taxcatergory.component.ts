import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { FinanceService } from 'src/app/services/finance/finance.service';

@Component({
  selector: 'app-taxcatergory',
  templateUrl: './taxcatergory.component.html',
  styleUrls: ['./taxcatergory.component.scss']
})
export class TaxcatergoryComponent implements OnInit {

  taxFrom : FormGroup 
  columnTaxdefs : any;
  gridOptions!: Partial<GridOptions>;
  gridApi: any;
  gridColumnApi:any;
  TaxList: any[] = [];
  rowStyle!: { background: string; };
  searchValue: any;

  vartaxid: string = "";
  vartaxname: string = "";
  vartaxGroup: string = "";
  varsequence: string = "";
  vartaxper: string = "";
  varpostacc: string = "";
  varremarks: string = "";
  varactive: string = "";

  constructor(private financeservice : FinanceService) { 
    this.taxFrom = new FormGroup({
      taxid: new FormControl('', [Validators.required]),
      taxName: new FormControl('', [Validators.required]),
      TaxGroup: new FormControl('', [Validators.required]),
      Sequence: new FormControl('', [Validators.required]),
      TaxPer: new FormControl('', [Validators.required]),
      PostAcc: new FormControl('', [Validators.required]),
      remarks: new FormControl('', [Validators.required]),
      active: new FormControl('', [Validators.required]),
    })
    this.columnTaxdefs = [
      { 
        headername: "Tax Category ID",
        sortable: true,
        field: "TAX_CATEGORY_CD",
        width: 200
      },
      { 
        headerName: "Tax Category Name", 
        field: 'TAX_CATEGORY_NAME', 
        width:300, 
        suppressMenu: false, 
        unSortIcon: true,
        sortable: true,
        tooltipField: "TAX_CATEGORY_NAME", 
        headerTooltip: "TAX_CATEGORY_NAME" 
      },
      { 
        headername: "Tax Percentage",
        field: "TAX_1_PERC",
        filter: true,
        rowGroup:true,
        enableRowGroup: true,
        width:200
      },
      { 
        headername: "Posting Account Number",
        filter: true,
        sortable: true,
        field: "TAX_1_GL_AC_NO",
        width:150,
        rowGroup:true
      },
    ];
  }

  onGridTaxReady(params: any){ 
    this.gridApi= params.api;
    this.gridColumnApi= params.columnApi;
    this.financeservice.getAllTaxCategory().subscribe((res: any) =>  {
      console.log(this.TaxList);
      this.TaxList=res.recordset;
      params.api.setRowData(this.TaxList);
      console.log(this.TaxList);
    }, (error: any) => {
      console.log(error);
    });
  }

  onViewCellClicked(event: any){
    console.log(event.data);
    if (event.column.colId =="TAX_CATEGORY_NAME" ){
     this.vartaxid = event.data.TAX_CATEGORY_CD;
     this.vartaxname= event.data.TAX_CATEGORY_NAME;
     this.varsequence= event.data.SEQUENCE;
     this.vartaxper = event.data.TAX_1_PERC;
     this.varpostacc = event.data.TAX_1_GL_AC_NO;
     if(event.data.ACTIVE){
      this.varactive ="Yes";
     }else{
      this.varactive ="No";
     }
     
     this.vartaxGroup = event.data.TAX_GROUP_ID;
     this.varremarks = event.data.DESCRIPTION;
    }
  }

  quickSeriveSearch() { 
    this.gridApi.setQuickFilter(this.searchValue);
  }
  

  ngOnInit(): void {
  }

}
