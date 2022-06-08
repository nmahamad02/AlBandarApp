
import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { CrmService } from 'src/app/services/crm/crm.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from "@angular/material/sort";
import * as XLSX from 'xlsx';
import { Router } from "@angular/router";


@Component({
  selector: 'app-reference-list',
  templateUrl: './reference-list.component.html',
  styleUrls: ['./reference-list.component.scss']
})
export class ReferenceListComponent implements OnInit {
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
  columns: any[];
  referenceListDataSource = new MatTableDataSource(this.refList);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;

  constructor(private crmservices: CrmService, private router: Router) {

    this.columns = ["PCODE", "NAME", "DESCRIPTION", "TYPE", "Actions"];
  }

  ngOnInit(): void {
    this.crmservices.getReference().subscribe((res: any) => {
      console.log(this.refList);
      this.refList = res.recordset;
      this.referenceListDataSource = new MatTableDataSource(this.refList);
      this.referenceListDataSource.sort = this.sort;
      this.referenceListDataSource.paginator = this.paginator;
    }, (error: any) => {
      console.log(error);
    });
  }

  exportAsExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);//converts a DOM TABLE element to a worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');

  }

  quickPartyrSearch() {

    this.referenceListDataSource.filter = this.searchValue.trim().toLowerCase();
  }

  public gotoReferenceDetails(url, id) {
    var myurl = `${url}/${id}`;
    this.router.navigateByUrl(myurl).then(e => {
    });
  }

}
