import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { GridOptions } from 'ag-grid-community';
import { CrmService } from 'src/app/services/crm/crm.service';
import { FinanceService } from 'src/app/services/finance/finance.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from "@angular/material/sort";
import * as XLSX from 'xlsx';
import { Router } from "@angular/router";

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {
  departmentList: any[] = [];
  departmentListDataSource = new MatTableDataSource(this.departmentList);
  columns: any[];
  searchValue: any;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;

  constructor(private crmservices: CrmService, private router: Router) {

    this.columns = ["DEPT_ID", "PREFIX", "DEPT_NAME", "Actions"];

  }

  ngOnInit(): void {

    this.crmservices.getAllDepartmentMaster().subscribe((res: any) => {
      this.departmentList = res.recordset;
      this.departmentListDataSource = new MatTableDataSource(this.departmentList);
      this.departmentListDataSource.sort = this.sort;
      this.departmentListDataSource.paginator = this.paginator;
    }, (error: any) => {
      console.log(error);
    });

  }

  quickPartyrSearch() {

    this.departmentListDataSource.filter = this.searchValue.trim().toLowerCase();
  }

  public gotoDepartmentDetails(url, id) {
    var myurl = `${url}/${id}`;
    this.router.navigateByUrl(myurl).then(e => {

    });
  }

}
