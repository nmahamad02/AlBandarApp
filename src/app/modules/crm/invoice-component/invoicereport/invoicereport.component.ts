import { Input, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';

@Component({
  selector: 'app-invoicereport',
  templateUrl: './invoicereport.component.html',
  styleUrls: ['./invoicereport.component.scss'],

})

export class InvoicereportComponent implements OnInit {
  mInvNo: string = "";
  srcFile: string = "";

  constructor( private route: ActivatedRoute, private router: Router,) {}
  
  ngOnInit(): void {
    this.getInvoice(this.route.snapshot.params.id);
  }

  getInvoice(src: string){
    this.mInvNo = src;
    this.srcFile = this.mInvNo + ".pdf";
  }

  public goToInvoice() {
    var id = this.mInvNo;
    var myurl = `/invoice/details/${id}`;
    this.router.navigateByUrl(myurl).then(e => {
    });
  }
}
