
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { GridOptions } from 'ag-grid-community';
import { ClubserivceService } from 'src/app/services/clubservice/clubserivce.service';
import { CrmService } from 'src/app/services/crm/crm.service';
import * as ExcelJS from  'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';
const EXCEL_EXTENSION = '.xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Component({
  selector: 'boat',
  templateUrl: './boat.component.html',
  styleUrls: ['./boat.component.scss']
})
export class BoatComponent implements OnInit {

  @ViewChild('BoatLookupDialog') BoatLookupDialog!: TemplateRef<any>;
  @ViewChild('membLookupDialog') membLookupDialog!: TemplateRef<any>;

  columnBoatDefs:any;
  gridOptions!: Partial<GridOptions>;
  rowStyle!: { background: string; };
  searchValue: any;
  boatForm: any;
  selectedRowIndex: any = 0;
  columns: any[];
  mYear = '2022';
  mBoatNo = '';
  gridApi: any;
  gridColumnApi:any;
  boatlist: any[] = [];
  boatArr: any[] = [];
  mNewBoatNo : any;
  membArr: any[] = [];
  utc = new Date();
  mCurDate = this.formatDate(this.utc);
  mBoatData: any;
  mBoatType: any;

  BoatDisplayedColumns: string[] = ['boatid', 'boatname', 'membercode', 'registerno'];
  BoatDataSource = new MatTableDataSource(this.boatArr);

  membDisplayedColumns: string[] = ['memberNo', 'memberRefNo', 'title', 'firstname', 'surname', 'cprno'];
  membDataSource = new MatTableDataSource(this.membArr);

  varboatMasterId: string = "";
  varmemberCode: string = "";
  varboatType:string = "";
  varRegistrationNo: string = "";
  varboatColor: string = "";
  varboatEngineType: string = "";
  varmodelNo: string = "";
  vvarboatEngineNo: string = "";
  varhostPower: string = "";
  varexpiryDate: string = "";
  varregExpiry: string = "";
  vardeleteFlag: string = "";
  varboatName: string = "";
  varinsuranceNo: string = "";
  varinsuranceExpiry: string = "";
  varjetskiReg: string = "";
  varjetskiExpiry: string = "";
  varboatNo: string = "";
  varlicenseExpiry: string = "";

  

  constructor(private dailog:MatDialog,private clubservice:ClubserivceService,private snackBar: MatSnackBar,private crmservice:CrmService) {
    this.boatForm = new FormGroup({
      memberCode: new FormControl('', [Validators.required]),
      boatType: new FormControl('', [Validators.required]),
      registrationNo: new FormControl('', [Validators.required]),
      boatColor: new FormControl('', []),
      boatEngineType: new FormControl('', [Validators.required]),
      modelNo: new FormControl('', [Validators.required]),
      boatEngineNo: new FormControl('', [Validators.required]),
      hostPower: new FormControl('', []),
      expiryDate: new FormControl('', [Validators.required]),
      regExpiry: new FormControl('', [Validators.required]),
      deleteFlag: new FormControl('', []),
      boatName: new FormControl('', [Validators.required]),
      insuranceNo: new FormControl('', []),
      insuranceExpiry: new FormControl('', []),
      jetskiReg: new FormControl('', []),
      jetskiExpiry: new FormControl('', []),
      boatNo: new FormControl('', [Validators.required]),
      licenseExpiry: new FormControl('', [Validators.required]),
      boatlength: new FormControl('', [Validators.required]),
      parkingslot: new FormControl('', [Validators.required]),
    });

    this.columnBoatDefs = [
      { 
        headername: "Boat No",
        sortable: true ,
        field: "BoatNo", rowGroup: true,
        width: 100
      },
      { 
        headerName: "Boat Name", 
        field: 'BoatName', 
        width:300, 
        suppressMenu: false, 
        unSortIcon: true,
        sortable: true, 
        tooltipField: "BoatName", 
        headerTooltip: "BoatName" 
      },
      { 
        headerName: "Registration No", 
        field: 'RegistrationNo', 
        width:100, 
        suppressMenu: false, 
        unSortIcon: true,
        sortable: true, 
        tooltipField: "RegistrationNo", 
        headerTooltip: "RegistrationNo"
      },
      { 
        headername: "Insureance No",
        filter: true,
        sortable: true,
        field: "InsuranceNo",
        width:100
      },
      { 
        headername: "Model No",
        filter: true,
        sortable: true,
        field: "ModelNo",
        width:100
      },
    ]
    this.getAllExportBoatData();
    this.columns = ["Boat No","Boat Name","Member No","Member Name","Registration No","Sailing License Expiry Date","Reg Expiry","License Expiry Date","Insurance No","Insurance Exp Date"];

   }

  ngOnInit(): void {
    this.getBoatType();
  }

  
  lookUpBoatNo(value: string) {
    console.log(value)
    this.selectedRowIndex = 0;
    let dialogRef = this.dailog.open(this.BoatLookupDialog);    
    this.clubservice.searchBoatMaster(value).subscribe((res: any) => {
      this.boatArr = res.recordset;
      this.BoatDataSource = new MatTableDataSource(this.boatArr);
     
    }, (err: any) => {
      console.log(err);
    })
  }

  getAllExportBoatData(){
    this.clubservice.getAllExprtBoatMaster().subscribe((res: any) => {
        this.mBoatData = res.recordset;
        console.log(this.mBoatData);
    },(err: any) => {
        console.log(err)
    })
  }

  arrowUpEvent(type: string, index: number){
    this.highlight(type, --index);
  }

  arrowDownEvent(type: string, index: number){
    this.highlight(type, ++index);
  }

  highlight(type: string, index: number){
    if (type === "boat") {
      if(index >= 0 && index <= this.boatArr.length - 1)
      this.selectedRowIndex = index;
    }else  if (type === "membs") {
      if(index >= 0 && index <= this.membArr.length - 1)
      this.selectedRowIndex = index;
    }
  }

  lookUpMembers(value: string, type: string) {
    this.selectedRowIndex = 0;
    let dialogRef = this.dailog.open(this.membLookupDialog);
    if(type === 'I') { //MEMBERCODE
      this.crmservice.searchMembers(value).subscribe((res: any) => {
        this.membArr = res.recordset;
        this.membDataSource = new MatTableDataSource(this.membArr);
      }, (err: any) => {
        console.log(err);
      })
    } 
  }

  getMemberData(value:string, condition: string) {
    if(condition === 'I') { //MEMBERCODE
      this.crmservice.getMembers(value).subscribe((res: any) => {
        console.log(res);
        const data = res.recordset[0];
        this.boatForm.patchValue({
          memberCode: data.MemberNo
        });
      },(err: any) => {
        console.log(err)
      });
    }
  }

  selectMemb(data: any) {
    this.boatForm.patchValue({
      memberCode: data.MemberNo
    });
    let dialogRef = this.dailog.closeAll();
  }

  searchBoat(boatno: any) {
    this.clubservice.getBoatMaster(boatno).subscribe((res: any) => {
      this.selectBoat(res.recordset[0]);
    }, (err: any) => {
      console.log(err);
    })
  }

  getBoatType() {
    this.clubservice.getBoatType().subscribe((res: any) => {
      this.mBoatType = res.recordset
    }, (err: any) => {
      console.log(err);
    })
  }

  public exportAsExcelFile(
    reportHeading: string,
    reportSubheading: string,
    headerArray: any[],
    excelfileName: string,
    sheetname:string
    
    ) {
      const data = this.mBoatData;
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
        worksheet.getColumn(1).width = 12;
        worksheet.getColumn(2).width = 25;
        worksheet.getColumn(3).width = 18;
        worksheet.getColumn(4).width = 35;
        worksheet.getColumn(5).width = 18;
        worksheet.getColumn(6).width = 32;
        worksheet.getColumn(7).width = 32;
        worksheet.getColumn(8).width = 32;
        worksheet.getColumn(9).width = 18;
        worksheet.getColumn(10).width = 32;
        // worksheet.getColumn(index).width = header[index - 1].length < 20 ? 20 : header[index - 1].length;

      });

      let columnsArray: any[];
      for (const key in this.mBoatData){
        if(this.mBoatData.hasOwnProperty(key)){
          columnsArray = Object.keys(this.mBoatData[key]);
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

  exportAsXLSX(){
    this.exportAsExcelFile('AL Bander Hotel & Resort','All Boat List',this.columns,'boat-Report','sheet1')
  }

  onViewCellClicked(event: any){
    console.log(event.data);
    if (event.column.colId =="BoatName" ){
      this.boatForm.patchValue({
        memberCode: event.data.MemberCode,
        boatType: event.data.BoatType,
        registrationNo: event.data.RegistrationNo,
        boatColor: event.data.BoatColor,
        boatEngineType: event.data.BoatEngineType,
        modelNo: event.data.ModelNo,
        boatEngineNo: event.data.BoatEngineNo,
        hostPower: event.data.HostPower,
        expiryDate: event.data.SailingLicenseExpiryDate,
        regExpiry: event.data.RegExpiry,
        deleteFlag: event.data.DeleteFlag,
        boatName: event.data.BoatName,
        insuranceNo: event.data.InsuranceNo,
        insuranceExpiry: event.data.InsuranceExpDate,
        jetskiReg: event.data.JetSkiRegNo,
        jetskiExpiry: event.data.JetSkiExpDate,
        boatNo: event.data.BoatNo,
        licenseExpiry: event.data.LicenseExpiryDate,
        boatlength: event.data.boatlength,
        parkingslot: event.data.boatslot
      });
    }else if (event.column.colId =="BoatNo" ){
      this.boatForm.patchValue({
        memberCode: event.data.MemberCode,
        boatType: event.data.BoatType,
        registrationNo: event.data.RegistrationNo,
        boatColor: event.data.BoatColor,
        boatEngineType: event.data.BoatEngineType,
        modelNo: event.data.ModelNo,
        boatEngineNo: event.data.BoatEngineNo,
        hostPower: event.data.HostPower,
        expiryDate: event.data.SailingLicenseExpiryDate,
        regExpiry: event.data.RegExpiry,
        deleteFlag: event.data.DeleteFlag,
        boatName: event.data.BoatName,
        insuranceNo: event.data.InsuranceNo,
        insuranceExpiry: event.data.InsuranceExpDate,
        jetskiReg: event.data.JetSkiRegNo,
        jetskiExpiry: event.data.JetSkiExpDate,
        boatNo: event.data.BoatNo,
        licenseExpiry: event.data.LicenseExpiryDate,
        boatlength: event.data.boatlength,
        parkingslot: event.data.boatslot
      });
    }

  }
  
  refreshForm() {
    this.boatForm = new FormGroup({
      memberCode: new FormControl('', [Validators.required]),
      boatType: new FormControl('', [Validators.required]),
      registrationNo: new FormControl('', [Validators.required]),
      boatColor: new FormControl('', []),
      boatEngineType: new FormControl('', [Validators.required]),
      modelNo: new FormControl('', [Validators.required]),
      boatEngineNo: new FormControl('', [Validators.required]),
      hostPower: new FormControl('', []),
      expiryDate: new FormControl('', [Validators.required]),
      regExpiry: new FormControl('', [Validators.required]),
      deleteFlag: new FormControl('', []),
      boatName: new FormControl('', [Validators.required]),
      insuranceNo: new FormControl('', []),
      insuranceExpiry: new FormControl('', []),
      jetskiReg: new FormControl('', []),
      jetskiExpiry: new FormControl('', []),
      boatNo: new FormControl('', [Validators.required]),
      licenseExpiry: new FormControl('', [Validators.required]),
      boatlength: new FormControl('', [Validators.required]),
      parkingslot: new FormControl('', [Validators.required]), 
    });
    
  }

  newForm() {
    this.clubservice.getBoatDocNo(this.mYear).subscribe(( res: any )=> {
      this.mNewBoatNo = res.recordset[0].FIELD_VALUE_NM + 1;
      const newBoatDocno = 'BOAT-' + this.mNewBoatNo.toString();
      this.boatForm = new FormGroup({
        memberCode: new FormControl('', [Validators.required]),
        boatType: new FormControl('', [Validators.required]),
        registrationNo: new FormControl('', [Validators.required]),
        boatColor: new FormControl('', []),
        boatEngineType: new FormControl('', [Validators.required]),
        modelNo: new FormControl('', [Validators.required]),
        boatEngineNo: new FormControl('', [Validators.required]),
        hostPower: new FormControl('', []),
        expiryDate: new FormControl('', [Validators.required]),
        regExpiry: new FormControl('', [Validators.required]),
        deleteFlag: new FormControl('', []),
        boatName: new FormControl('', [Validators.required]),
        insuranceNo: new FormControl('', []),
        insuranceExpiry: new FormControl('', []),
        jetskiReg: new FormControl('', []),
        jetskiExpiry: new FormControl('', []),
        boatNo: new FormControl(newBoatDocno, [Validators.required]),
        licenseExpiry: new FormControl('', [Validators.required]),
        boatlength: new FormControl('', [Validators.required]),
        parkingslot: new FormControl('', [Validators.required]), 
      });
    },(err: any) =>{

    })
    
  }

  onGridBoatReady(params: any){ 
    this.gridApi= params.api;
    this.gridColumnApi= params.columnApi;
    this.clubservice.getAllBoatMaster().subscribe((res: any) =>  {
      console.log(this.boatlist);
      this.boatlist=res.recordset;
      params.api.setRowData(this.boatlist);
      console.log(this.boatlist);
    }, (error: any) => {
      console.log(error);
    });
  }

  quickBoatSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  selectBoat(obj: any) {
    this.mBoatNo = obj.BoatMasterID;
    this.boatForm.patchValue({
      boatMasterId: obj.BoatMasterID,
      memberCode: obj.MemberCode,
      boatType: obj.BoatType,
      registrationNo: obj.RegistrationNo,
      boatColor: obj.BoatColor,
      boatEngineType: obj.BoatEngineType,
      modelNo: obj.ModelNo,
      boatEngineNo: obj.BoatEngineNo,
      hostPower: obj.HostPower,
      expiryDate: obj.SailingLicenseExpiryDate,
      regExpiry: obj.RegExpiry,
      deleteFlag: obj.DeleteFlag,
      boatName: obj.BoatName,
      insuranceNo: obj.InsuranceNo,
      insuranceExpiry: obj.InsuranceExpDate,
      jetskiReg: obj.JetSkiRegNo,
      jetskiExpiry: obj.JetSkiExpDate,
      boatNo: obj.BoatNo,
      licenseExpiry: obj.LicenseExpiryDate,
      boatlength: obj.boatlength,
      parkingslot: obj.boatslot
    });
    let dialogRef = this.dailog.closeAll();
  }

  submitForm() {
    const data = this.boatForm.value;
    console.log(data);
    console.log(data.boatType)
    this.clubservice.getBoatDocNo(this.mYear).subscribe(( res: any )=> {
      this.mNewBoatNo = res.recordset[0].FIELD_VALUE_NM + 1;
      const newBoatDocno = 'BOAT-' + this.mNewBoatNo.toString();
        if(data.boatNo == newBoatDocno){
          this.clubservice.postBoatMaster(data.memberCode,data.boatType,data.registrationNo,data.boatColor,data.boatEngineType,
          data.modelNo,data.boatEngineNo,data.hostPower,this.formatDate(data.expiryDate),this.formatDate(data.regExpiry),this.mCurDate,
          data.boatName,data.insuranceNo,this.formatDate(data.insuranceExpiry),data.jetskiReg,this.formatDate(data.jetskiExpiry),newBoatDocno,this.formatDate(data.licenseExpiry),data.boatlength,data.parkingslot);
        
          this.clubservice.UpdateBoatDocNo(this.mYear,this.mNewBoatNo);

          this.snackBar.open(newBoatDocno + " successfully added", "close", {
            duration: 10000,
            verticalPosition: 'top',
            panelClass: ['sbBg']
          });
          this.searchBoat(newBoatDocno);
        
        this.refreshForm();
      }else{
        this.clubservice.updateBoatMaster(data.memberCode,data.boatType,data.registrationNo,data.boatColor,data.boatEngineType,
        data.modelNo,data.boatEngineNo,data.hostPower,this.formatDate(data.expiryDate),this.formatDate(data.regExpiry),this.mCurDate,
        data.boatName,data.insuranceNo,this.formatDate(data.insuranceExpiry),data.jetskiReg,this.formatDate(data.jetskiExpiry),data.boatNo,this.formatDate(data.licenseExpiry),data.boatlength,data.parkingslot);
      
        this.snackBar.open(data.boatNo + " successfully Updated", "close", {
          duration: 10000,
          verticalPosition: 'top',
          panelClass: ['sbBg']
        });

        this.refreshForm()
      }
    },(err: any ) => {
      console.log(err);
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
