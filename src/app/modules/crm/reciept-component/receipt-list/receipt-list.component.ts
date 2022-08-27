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
  selector: 'app-receipt-list',
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.scss']
})
export class ReceiptListComponent implements OnInit {
  searchValue: any;
  receiptList: any[] = [];
  receiptListDataSource = new MatTableDataSource(this.receiptList);
  columns: any[];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;

  constructor(private crmservices: CrmService, private router: Router, private financeService: FinanceService) {
    this.columns = ["custcode", "custname", "recno", "recdt", "recamount", "Actions"];
  }

  ngOnInit(): void {
    this.financeService.getAllReceipts().subscribe((res: any) => {
      this.receiptList = res.recordset;
      console.log(this.receiptList);
      this.receiptListDataSource = new MatTableDataSource(this.receiptList);
      this.receiptListDataSource.sort = this.sort;
      this.receiptListDataSource.paginator = this.paginator;
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

  quickReceiptSearch() {
    this.receiptListDataSource.filter = this.searchValue.trim().toLowerCase();
  }

  public gotoReceiptDetails(url, id) {
    var myurl = `${url}/${id}`;
    this.router.navigateByUrl(myurl).then(e => {
    });
  }
}
