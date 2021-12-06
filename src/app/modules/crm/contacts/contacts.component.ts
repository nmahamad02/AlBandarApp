import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ViewChild } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { GridOptions } from 'ag-grid-community';
import { CrmService } from 'src/app/services/crm/crm.service';
import * as ExcelJS from  'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';
import { FinanceService } from 'src/app/services/finance/finance.service';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';
const EXCEL_EXTENSION = '.xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  mYear = '2021';
  pcodeArr : any[] = [];
  AreaArr : any[] = [];
  varPartyId: string = "";
  public contactsForm: FormGroup;
  searchValue: any;
  gridOptions!: Partial<GridOptions>;
  contactList: any[] = [];
  columnDefs:any;
  gridApi: any;
  params: any;
  gridColumnApi:any;
  rowStyle: { background: string; } 
  sortingOrder:any;
  getpartyData: any;
  utc = new Date();
  mCurDate = this.formatDate(this.utc);
  pcodeDisplayedColumns: string[] = ['pcode', 'custname', 'opbal', 'glcode'];
  pcodeDataSource = new MatTableDataSource(this.pcodeArr);
  areaDisplayedColumns: string[] = ['areano', 'areaname'];
  areaDataSource = new MatTableDataSource(this.AreaArr);
  columns: any[];
  partyArr: any[] = [];
  /*varContactID: any;
  varConatctPerson: any;
  varName: String = "";
  varAdd1: String = "";
  VarAdd2: String = "";
  varAdd3: string = "";
  varFalt: string = "";
  varBuildingHouse: string = ""
  varRoad: any;
  varBlock: String = "";
  varArea: String = "";
  varPoBox: String = "";
  varRefNo: string = "";
  varMobileNo: string = "";
  varFax1: string = ""
  Varfax2: any;
  varEmail: string = "";
  varPhone1: string = ""
  varPhone2: any;*/
  mpcode: String = "";
  mPartyDetails: any;
  @ViewChild('pcodeLookupDailoug') pcodeLookupDailoug!: TemplateRef<any>;
  @ViewChild('areaLookupDailoug') areaLookupDailoug!: TemplateRef<any>;
  selectedRowIndex: any = 0;

  invReportApiUrl: string = "";
  invReportName: string = "";

  constructor(private crmservices:CrmService, public snackbar: MatSnackBar,private dialog:MatDialog,private financeservice: FinanceService,private dataSharing: DataSharingService ) { 
    this.contactsForm = new FormGroup({
      contactId: new FormControl('', [Validators.required]),
      contactPerson: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      pcode:new FormControl('',[Validators.required]),
      address1: new FormControl('', []),
      address2: new FormControl('', []),
      address3: new FormControl('', []),
      flat: new FormControl('', []),
      buildingHouse: new FormControl('', [Validators.required]),
      road: new FormControl('', [Validators.required]),
      block: new FormControl('', [Validators.required]),
      area: new FormControl('', []),
      poBox: new FormControl('', [Validators.required]),
      refNo: new FormControl('', [Validators.required]),
      mobileNo: new FormControl('', [Validators.required]),
      fax1: new FormControl('', []),
      fax2: new FormControl('', []),
      email: new FormControl('', [Validators.required]),
      phone1: new FormControl('', []),
      phone2: new FormControl('', []),
    });

    this.columns = ["Customer Code","Party ID","Party Name","Address 1","Address 3","Phone Number","Mobile","Email id","Fax1","Contact"];

    this.columnDefs = [
      { 
        headername: "ContactPerson NO",sortable: true ,
        field: "PARTY_ID",
        width: 85
      },
      { 
        headerName: "Contact Person Name", field: 'NAME', width:300, suppressMenu: false, unSortIcon: true,sortable: true, cellRenderer(params: { value: string; }) {
          // below line is just to create empty without any action hyperlink
          // to trick the user, but actual action happen onViewCellCliced() // function
          console.log(params.value);
          return '<a>' + params.value + '</a>';
        },
        tooltipField: "NAME", headerTooltip: "NAME" 
      },
      { 
        headername: "ADD1",filter: true,
        field: "ADD1",
        width:200
      },
      { 
        headername: "ADD2",filter: true,
        field: "ADD2",
        width:200
      },
      { 
        headername: "ADD3",filter: true,
        field: "ADD3",
        width:200
      },
      { 
        headername: "Phone Number",filter: true,
        field: "PHONE1",
        width:100
      },
      { 
        headername: "Mobile Number",filter: true,
        field: "TELOFF",
        width:200
      },
      { 
        headername: "Email-Id",filter: true,
        field: "EMAIL_ID",
        width:200
      },
    ];

    this.rowStyle = { background: 'rag-amber' };
    
  }
 
  
  ngOnInit(): void {
    this.getPartyexcel();
    this.invReportApiUrl = "coa/getOpbalForPrint";
    this.invReportName = "CLINETLIST.rdlx-json";
  }

  onGridPartyrDetails(params: any){ 
    this.gridApi= params.api;
    this.gridColumnApi= params.columnApi;
    this.crmservices.getParty().subscribe((res: any) =>  {
      console.log(this.contactList);
      this.contactList=res.recordset;
      params.api.setRowData(this.contactList);
      console.log(this.contactList);
    }, (error: any) => {
      console.log(error);
    });
  }

  newForm() {
    this.contactsForm = new FormGroup({
      contactId: new FormControl('', [Validators.required]),
      contactPerson: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      pcode:new FormControl('',[Validators.required]),
      address1: new FormControl('', []),
      address2: new FormControl('', []),
      address3: new FormControl('', []),
      flat: new FormControl('', []),
      buildingHouse: new FormControl('', [Validators.required]),
      road: new FormControl('', [Validators.required]),
      block: new FormControl('', [Validators.required]),
      area: new FormControl('', []),
      poBox: new FormControl('', [Validators.required]),
      refNo: new FormControl('', [Validators.required]),
      mobileNo: new FormControl('', [Validators.required]),
      fax1: new FormControl('', []),
      fax2: new FormControl('', []),
      email: new FormControl('', [Validators.required]),
      phone1: new FormControl('', []),
      phone2: new FormControl('', []),
    });
  }

  quickPartyrSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
  }
  onViewCellClicked(event: any){
    console.log(event.data);
    if (event.column.colId =="NAME" ) // only first column clicked
    {
      this.contactsForm.patchValue({
        contactId: event.data.PARTY_ID,
        contactPerson: event.data.NAME,
        name: event.data.NAME,
        pcode:event.data.PCODE,
        address1: event.data.ADD1,
        address2: event.data.ADD2,
        address3: event.data.ADD3,
        flat: event.data.FLAT,
        buildingHouse: event.data.BUILDING,
        road: event.data.STREET,
        block: event.data.BLOCK,
        area: event.data.CITY,
        poBox: event.data.POBOX,
        refNo: event.data.REFNO,
        mobileNo:  event.data.MOBILE,
        fax1: event.data.FAX1,
        fax2: event.data.FAX2,
        email: event.data.EMAIL_ID,
        phone1: event.data.PHONE1,
        phone2: event.data.PHONE2
      })
      this.getPartyData( event.data.PARTY_ID);
    }
  }
  
  
  getPartyDetails(value : any){
    this.crmservices.getPartyDetails(value).subscribe((res: any) => {
      this.selectParty(res.recordset[0])
    }, (err: any) => {
      console.log(err);
    })

  }

  selectParty(data: any){
    this.contactsForm.patchValue({
      contactId: data.PARTY_ID,
      contactPerson: data.NAME,
      name: data.NAME,
      pcode:data.PCODE,
      address1: data.ADD1,
      address2: data.ADD2,
      address3: data.ADD3,
      flat: data.FLAT,
      buildingHouse: data.BUILDING,
      road: data.STREET,
      block: data.BLOCK,
      area: data.CITY,
      poBox: data.POBOX,
      refNo: data.REFNO,
      mobileNo:  data.MOBILE,
      fax1: data.FAX1,
      fax2: data.FAX2,
      email: data.EMAIL_ID,
      phone1: data.PHONE1,
      phone2: data.PHONE2
    })
  }
  getPartyData(partyNo:any) {
    this.crmservices.getPartyDetails(partyNo).subscribe((res: any) => {
      this.mPartyDetails = res.recordset[0];
      console.log(this.mPartyDetails);
    }, (err: any) => {
      console.log(err);
    })

  }

  lookUpPcode(value: string) {
    console.log(value)
    this.selectedRowIndex = 0;
    let dialogRef = this.dialog.open(this.pcodeLookupDailoug);    
    this.crmservices.getPcodeFromName(value, this.mYear).subscribe((res: any) => {
      this.pcodeArr = res.recordset;
      this.pcodeDataSource = new MatTableDataSource(this.pcodeArr);
    }, (err: any) => {
      console.log(err);
    })
  }

  lookUpArea(value: string) {
    console.log(value)
    this.selectedRowIndex = 0;
    let dialogRef = this.dialog.open(this.areaLookupDailoug);    
    this.financeservice.getAreaName(value).subscribe((res: any) => {
      this.AreaArr = res.recordset;
      this.areaDataSource = new MatTableDataSource(this.AreaArr);
    }, (err: any) => {
      console.log(err);
    })
  }

  highlight(type: string, index: number){
    if(type === "prod"){
      if(index >= 0 && index <= this.pcodeArr.length - 1)
      this.selectedRowIndex = index;
    }else if(type === "area"){
      if(index >= 0 && index <= this.AreaArr.length - 1)
      this.selectedRowIndex = index;
    }
      
  }

  arrowUpEvent(type: string, index: number){
    this.highlight(type, --index);
   }
 
   arrowDownEvent(type: string, index: number){
     this.highlight(type, ++index);
   }

   selectpcode(obj: any) {
     this.contactsForm.patchValue({
        pcode: obj.PCODE
     })
   
    let dialogRef = this.dialog.closeAll();
  }

  selectarea(obj: any) {
    
    this.contactsForm.patchValue({
      area: obj.AreaName
    })
   let dialogRef = this.dialog.closeAll();
 }



  submitForm() {
    const data = this.contactsForm.value;
    this.crmservices.getPartyDetails(data.contactId).subscribe((res: any) => {
      this.crmservices.deleteParty(data.contactId).subscribe((res: any) =>{
         console.log(res);
         this.crmservices.postParty('01',data.contactId,data.contactPerson,data.address1,data.address2,data.address3,data.phone1,data.phone2,data.mobileNo,data.email,
         data.fax1,data.fax2,data.refNo,data.contactPerson,data.flat,data.buildingHouse,data.road,data.block,data.area,data.poBox,'', data.pcode,'Rakshak',this.mCurDate,'',this.mCurDate);
         this.snackbar.open("Updated Successfully", "close", {
          duration: 10000,
          verticalPosition: 'top',
          panelClass: ['sbBg']
        });
      },(err: any) => {
        console.log(err)
      });
      
    }, (err: any) => {
      console.log(err)
      if(err.statusText === 'Not Found' ){
        this.snackbar.open("Please Enter PartyId", "close", {
          duration: 10000,
          verticalPosition: 'top',
          panelClass: ['sbBg']
        });
      }
      else{
        this.crmservices.postParty('01',data.contactId,data.contactPerson,data.address1,data.address2,data.address3,data.phone1,data.phone2,data.mobileNo,data.email,
        data.fax1,data.fax2,data.refNo,data.contactPerson,data.flat,data.buildingHouse,data.road,data.block,data.area,data.poBox,'',data.pcode,'Rakshak',this.mCurDate,'',this.mCurDate)
        this.snackbar.open("Inserted Successfully", "close", {
          duration: 10000,
          verticalPosition: 'top',
          panelClass: ['sbBg']
        });
      }
         
    })
    
    // console.log(data);
    // this.crmservices.postParty('01',data.contactId,data.contactPerson,data.address1,data.address2,data.address3,data.phone1,data.phone2,data.mobileNo,data.email,
    // data.fax1,data.fax2,data.refNo,data.contactPerson,data.flat,data.buildingHouse,data.road,data.block,data.area,data.poBox,'','','Rakshak','08-08-2021','','08-08-2021')
  }

  getPartyexcel(){
    this.financeservice.getPartyForExcel().subscribe((res: any) => {
      this.partyArr = res.recordset
      console.log(res)
    },(err: any) =>{
      console.log(err)
    })
  }
  public exportAsExcelFile(
    reportHeading: string,
    reportSubheading: string,
    headerArray: any[],
    excelfileName: string,
    sheetname:string
    
    ) {
      const data = this.partyArr;
      const header = headerArray;
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'ifasoft';
      workbook.lastModifiedBy = 'ifasoft';
      workbook.created = new Date();
      workbook.modified = new Date();
      const worksheet = workbook.addWorksheet(sheetname);

      worksheet.addRow([]);
      worksheet.mergeCells('A1:' + this.numToAlpha(header.length - 1) + '1');
      worksheet.getCell('A1').value = reportHeading;
      worksheet.getCell('A1').alignment = {horizontal: 'center'};
      worksheet.getCell('A1').font = {name:'Times New Roman',size:20 ,bold:false};

      if (reportSubheading !== ''){
        worksheet.addRow([]);
      worksheet.mergeCells('A2:' + this.numToAlpha(header.length - 1) + '2');
      worksheet.getCell('A2').value = reportSubheading;
      worksheet.getCell('A2').alignment = {horizontal: 'center'};
      worksheet.getCell('A2').font = {size:14 ,bold:false};
      
      }

      worksheet.addRow([]);

      const HeaderRow = worksheet.addRow(header);

      HeaderRow.eachCell((cell,index) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF00'},
          bgColor: { argb: 'FF0000FF'}
        };
        cell.border = {top: {style: 'thin'},left: {style: 'thin'},bottom: {style: 'thin'},right: {style: 'thin'}};
        cell.font = {name: 'Times New Roman', size: 12, bold: false};
        cell.alignment = {horizontal: 'center'};
        worksheet.getColumn(1).width = 15;
        worksheet.getColumn(2).width = 22;
        worksheet.getColumn(3).width = 40;
        worksheet.getColumn(4).width = 15;
        worksheet.getColumn(5).width = 32;
        worksheet.getColumn(6).width = 32;
        worksheet.getColumn(7).width = 32;
        worksheet.getColumn(8).width = 36;
        worksheet.getColumn(9).width = 21;
        worksheet.getColumn(10).width = 21;
        // worksheet.getColumn(index).width = header[index - 1].length < 20 ? 20 : header[index - 1].length;

      });

      let columnsArray: any[];
      for (const key in this.partyArr){
        if(this.partyArr.hasOwnProperty(key)){
          columnsArray = Object.keys(this.partyArr[key]);
        }
      }

      data.forEach((element: any) => {
        const eachrow = [];
        columnsArray.forEach((column) => {
          eachrow.push(element[column]);
        });

        if(element.isDeleted === 'Y'){
          const deleteRow = worksheet.addRow(eachrow);
          deleteRow.eachCell((cell) => {
            cell.font = {name: 'Times New Roman', family: 4, size:11, bold: false, strike: true};
          });
        } else {
          worksheet.addRow(eachrow);
        }
      });

      workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
        const blob = new Blob([data], {type: EXCEL_TYPE});
        FileSaver.saveAs(blob, excelfileName + EXCEL_EXTENSION);
      })
  }

  numToAlpha(num: number) {
    let alpha = '';
    for (; num >=0; num = parseInt((num / 26).toString(),10)-1){
      alpha = String.fromCharCode(num %  26 + 0x41) + alpha;
    }
    return alpha;
  }

  setReportData(apiUrl: string, reportType: string){
    const reportData = {
      apiUrl: apiUrl,
      reportType: reportType
    };
    this.dataSharing.setData(reportData);
  }

  ExportToExcel(){
    this.exportAsExcelFile('AL Bander Hotel & Resort','All Party List',this.columns,'Party-Report','sheet1')
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
