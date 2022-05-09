
import { Component, OnInit, ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CrmService } from 'src/app/services/crm/crm.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";

@Component({
  selector: 'app-costcenter-list',
  templateUrl: './costcenter-list.component.html',
  styleUrls: ['./costcenter-list.component.scss']
})
export class CostcenterListComponent implements OnInit {  
  searchValue: any;
  columns: any[];
  costCenterList: any[] = [];
  costCenterDataSource = new MatTableDataSource(this.costCenterList);


  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;

  constructor(private crmservices: CrmService, private router: Router) {
   
    this.columns = ["EXP_CODE", "EXP_DESC", "GL_CODE_AFFECTED", "Actions"];
  }
 

  ngOnInit(): void {

    this.crmservices.getAllExpenseforGrid().subscribe((res: any) => {
      console.log(this.costCenterList);
      this.costCenterList = res.recordset;
      this.costCenterDataSource = new MatTableDataSource(this.costCenterList);
      this.costCenterDataSource.sort = this.sort;
      this.costCenterDataSource.paginator = this.paginator;
    }, (error: any) => {
      console.log(error);
    });
  }

  quickPartyrSearch() {

    this.costCenterDataSource.filter = this.searchValue.trim().toLowerCase();
  }

  public gotoCostcenterDetails(url, id) {
    var myurl = `${url}/${id}`;
    this.router.navigateByUrl(myurl).then(e => {

    });
  }

}
