import {ElementRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CrmService } from 'src/app/services/crm/crm.service';
import { FinanceService } from 'src/app/services/finance/finance.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from "@angular/material/sort";
import * as XLSX from 'xlsx';
import { Router } from "@angular/router";

@Component({
  selector: 'app-sales-order-list',
  templateUrl: './sales-order-list.component.html',
  styleUrls: ['./sales-order-list.component.scss']
})
export class SalesOrderListComponent implements OnInit {
  searchValue: any;
  salesOrderList: any[] = [];
  salesOrderListDataSource = new MatTableDataSource(this.salesOrderList);
  columns: any[];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;

  constructor(private crmservices: CrmService, private router: Router, private financeService: FinanceService) {
    this.columns = ["SONO", "QUOTNO", "SODATE", "CUST_NAME", "Actions"];
  }

  ngOnInit(): void {
    this.financeService.getAllSalesOrders().subscribe((res: any) => {
      this.salesOrderList = res.recordset;
      this.salesOrderListDataSource = new MatTableDataSource(this.salesOrderList);
      this.salesOrderListDataSource.sort = this.sort;
      this.salesOrderListDataSource.paginator = this.paginator;
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

  quickSalesOrderSearch() {
    this.salesOrderListDataSource.filter = this.searchValue.trim().toLowerCase();
  }

  public gotoSODetails(url, id) {
    var myurl = `${url}/${id}`;
    this.router.navigateByUrl(myurl).then(e => {
    });
  }

}
