import { Input, ViewChild } from '@angular/core';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AR_EXPORTS, HtmlExportService, PdfExportService, ViewerComponent, XlsxExportService } from '@grapecity/activereports-angular';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';

@Component({
  selector: 'app-invoicereport',
  templateUrl: './invoicereport.component.html',
  styleUrls: ['./invoicereport.component.scss'],
  providers: [
    {
      provide: AR_EXPORTS,
      useClass: PdfExportService,
      multi: true,
    },
    {
      provide: AR_EXPORTS,
      useClass: HtmlExportService,
      multi: true,
    },
    {
      provide: AR_EXPORTS,
      useClass: XlsxExportService,
      multi: true,
    },
  ],
})
export class InvoicereportComponent implements AfterViewInit {

  reportMetaData: any;

  constructor(private dataSharing: DataSharingService) {
    this.reportMetaData = dataSharing.getData();
    console.log(this.reportMetaData);
  }

  @ViewChild(ViewerComponent, { static: false })
  reportViewer!: ViewerComponent;
  async loadData() {
    // Use the Fetch Api to pull the data https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const headers = new Headers();

    const dataRequest = new Request(
      "http://15.185.46.105:5001/api/" + this.reportMetaData.apiUrl,
      // "http://15.185.46.105:5001/api/coa/getOpbalForPrint",

      {
        headers: headers,
      }
    );

    const response = await fetch(dataRequest);
    const data = await response.json();
    return data;
  }
  async loadReport() {
    // load report definition from the file
    const reportResponse = await fetch(
      "assets/" + this.reportMetaData.reportType
      // "assets/CLINETLIST.rdlx-json"

    );
    const report = await reportResponse.json();
    return report;
  }

  async onViewerInit(){
    const data = await this.loadData();
    const report = await this.loadReport();
    // update the embedded data
    report.DataSources[0].ConnectionProperties.ConnectString = "jsondata=" + JSON.stringify(data);
    this.reportViewer.open(report);
  }

  async ngAfterViewInit(): Promise<void> {
    
  }


  // ngOnInit(): void {
  // }

}
