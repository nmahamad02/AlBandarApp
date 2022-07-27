import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ElementRef, ViewChild } from '@angular/core';
import { FinanceService } from 'src/app/services/finance/finance.service';
import * as ExcelJS from  'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';
const EXCEL_EXTENSION = '.xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from '@angular/material/table';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-customerprofile',
  templateUrl: './customerprofile.component.html',
  styleUrls: ['./customerprofile.component.scss']
})
export class CustomerprofileComponent implements OnInit {
  public custForm: FormGroup;
  public balForm: FormGroup;
  currentYear = new Date().getFullYear()
  searchValue: any;
  customerlist: any[] = [];
  custPartyList: any[] = [];
  custMemberList: any[] = [];
  custInvoiceList: any[] = [];
  custAgreementList: any[] = [];
  AccountsCategoryList: any[] = [];
  AccountsTypeList: any[] = [];
  custExcelArr: any[] = [];

  rowStyle!: { background: string; };
  sortingOrder:any;
  
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;

  varpcode:string = "";
  varsfyear:string ="2022-01-01";
  varefyear:string ="2022-01-01";
  opbalChartBool: boolean = false;
  
  contactListDataSource = new MatTableDataSource(this.custPartyList);
  memberListDataSource = new MatTableDataSource(this.custMemberList);

  columns: any[];
  contactsColumns = ["PARTY_ID", "NAME", "ADD1", "ADD2", "ADD3", "PHONE1", "Actions"];
  memberColumns = ["MemberNo", "NAME", "DEPT_NAME", "MEMBTYPE", "Actions"];
  //contactsColumns = ["PARTY_ID", "NAME", "ADD1", "ADD2", "ADD3", "PHONE1", "Actions"];
  //contactsColumns = ["PARTY_ID", "NAME", "ADD1", "ADD2", "ADD3", "PHONE1", "Actions"];

  constructor(private financeservice: FinanceService, private snackbar: MatSnackBar, private dataSharing: DataSharingService, private route: ActivatedRoute, private router: Router){
    this.custForm = new FormGroup({
      pcode: new FormControl('', [ Validators.required]),
      cname: new FormControl('', [ Validators.required]),
      cStatus: new FormControl('', [ Validators.required]),
      cAccountCategory: new FormControl('', [ Validators.required]),
      cType: new FormControl('', [ Validators.required]),
      cCR: new FormControl('', [ Validators.required]),
      cTaxNo: new FormControl('', [ Validators.required])
    });
  }

  newForm() {
    this.custForm = new FormGroup({
      pcode: new FormControl('', [ Validators.required]),
      cname: new FormControl('', [ Validators.required]),
      cStatus: new FormControl('', [ Validators.required]),
      cAccountCategory: new FormControl('', [ Validators.required]),
      cType: new FormControl('', [ Validators.required]),
      cCR: new FormControl('', [ Validators.required]),
      cTaxNo: new FormControl('', [ Validators.required])
    });
  }

  refreshForm(){
    this.custForm = new FormGroup({
      pcode: new FormControl('', [ Validators.required]),
      cname: new FormControl('', [ Validators.required]),
      cStatus: new FormControl('', [ Validators.required]),
      cAccountCategory: new FormControl('', [ Validators.required]),
      cType: new FormControl('', [ Validators.required]),
      cCR: new FormControl('', [ Validators.required]),
      cTaxNo: new FormControl('', [ Validators.required])
    });
  }

  getCustmerDetails(pcode: any){
    this.financeservice.getCustomerBypcode(pcode).subscribe((res:any) => {
      this.selectCustomer(res.recordset[0])
    },(err: any)=>{
      console.log(err);
    })
  }

  selectCustomer(data: any){
    this.custForm.patchValue({
      pcode: data.PCODE,
      cname: data.CUST_NAME,
      cStatus: data.STATUS,
      cAccountCategory: data.ACCOUNT_CATEGORY_CD,
      cType: data.ACCOUNT_TYPE_CD,
      cCR: data.CR_CPR,
      cTaxNo: data.TAX_1_NO  
    });
    this.varpcode = data.PCODE;
    this.getCustmerParty(this.varpcode);
    this.getCustmerInvoices(this.varpcode,this.varsfyear,this.varefyear);
    this.getCustomerMember(this.varpcode);
    this.getAggrementDetails(this.varpcode);
  }

  submitForm(){
    const data = this.custForm.value
    if (data.pcode == ''){
      this.snackbar.open("Please Enter Pcode", "close", {
        duration: 10000,
        verticalPosition: 'top',
        panelClass: ['sbBg']
      });
    }
    else{
      this.financeservice.getCustomerBypcode(data.pcode).subscribe((res: any) => {
        this.financeservice.updateOPbalDeatils(data.cname,data.cAccountCategory,data.cStatus,data.cType,data.cCR,data.cTaxNo,data.pcode)
        this.snackbar.open(data.pcode + " Updated Successfully", "close", {
          duration: 10000,
          verticalPosition: 'top',
          panelClass: ['sbBg']
        });
      },(err:any) =>{
        this.financeservice.postOpbalDetails('01',data.pcode,data.cname,data.cAccountCategory,data.cType,data.cCR,data.cTaxNo,data.cStatus,'2022')
        this.snackbar.open( data.pcode + " inserted Successfully", "close", {
          duration: 10000,
          verticalPosition: 'top',
          panelClass: ['sbBg']
        });
      })
    }
  }

  getCustmerParty(pcode:string) {
    this.financeservice.getCustomerParty(pcode, String(this.currentYear)).subscribe((res: any) => {
      this.custPartyList = res.recordset;
      console.log(this.custPartyList);
      this.contactListDataSource = new MatTableDataSource(this.custPartyList);
      this.contactListDataSource.sort = this.sort;
      this.contactListDataSource.paginator = this.paginator;
    }, (err: any) => {
      console.log(err);
    })
  }

  getCustomerMember(pcode:string) {
    this.financeservice.getCustomerMemner(pcode, String(this.currentYear)).subscribe((res: any) => {
      this.custMemberList = res.recordset;
      console.log(this.custMemberList);
      for (let i = 0; i < this.custMemberList.length; i++) {
        if (this.custMemberList[i].MEMBTYPE === 'F') {
          this.custMemberList[i].MEMBTYPE = 'Family';
          this.memberListDataSource = new MatTableDataSource(this.custMemberList);
          this.memberListDataSource.sort = this.sort;
          this.memberListDataSource.paginator = this.paginator;
        }
        else if (this.custMemberList[i].MEMBTYPE === 'C') {
          this.custMemberList[i].MEMBTYPE = 'Corporate';
          this.memberListDataSource = new MatTableDataSource(this.custMemberList);
          this.memberListDataSource.sort = this.sort;
          this.memberListDataSource.paginator = this.paginator;
        }
        else if (this.custMemberList[i].MEMBTYPE === 'S') {
          this.custMemberList[i].MEMBTYPE = 'Single';
          this.memberListDataSource = new MatTableDataSource(this.custMemberList);
          this.memberListDataSource.sort = this.sort;
          this.memberListDataSource.paginator = this.paginator;
        }
      }
    }, (err: any) => {
      console.log(err);
    })
  }
  
  getAccountsCategoryData() {
    this.financeservice.getAccountsCategory().subscribe((res: any) =>  {
      this.AccountsCategoryList=res.recordset;
    }, (error: any) => {
      console.log(error);
    });
  }

  getAccountsTypeData() {
    this.financeservice.getAccountsType().subscribe((res: any) =>  {
      this.AccountsTypeList=res.recordset;
    }, (error: any) => {
      console.log(error);
    }); 
  }
  
  getCustmerInvoices(pcode: string,sfyear: string,efyear: string) {
    this.financeservice.getCustomerInvoices(pcode, sfyear,efyear).subscribe((res: any) => {
      this.custInvoiceList = res.recordset;
    }, (err: any) => {
      console.log(err);
    })
  }

  getAggrementDetails(pcode: string) {
    this.financeservice.getAggrementDetails(pcode).subscribe((res: any) => {
      this.custAgreementList = res.recordset;
    }, (err: any) => {
      console.log(err);
    })
  }
  
  getCustomerExcel(){
    this.financeservice.getCustomerForExcel().subscribe((res:any) => {
      this.custExcelArr = res.recordset
      console.log(res.recordset)
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
      const data = this.custExcelArr;
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
        worksheet.getColumn(2).width = 40;
        worksheet.getColumn(3).width = 22;
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
      for (const key in this.custExcelArr){
        if(this.custExcelArr.hasOwnProperty(key)){
          columnsArray = Object.keys(this.custExcelArr[key]);
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

  exportTOexcel(){
    this.exportAsExcelFile('AL Bander Hotel & Resort','All Customer List',this.columns,'Customer-Report','sheet1')
  }

  ngOnInit(): void {
    this.getAccountsCategoryData();
    this.getAccountsTypeData();
    this.getCustomerExcel();
    this.getCustomerDetails(this.route.snapshot.params.id);
  }
  
  flipChartGrid() {
    this.opbalChartBool = !this.opbalChartBool;
  }

  getCustomerDetails(value: any) {
    this.varpcode = value
    this.financeservice.getCustomerBypcode(this.varpcode).subscribe((res: any) => {
      this.selectCustomerDetail(res.recordset[0]);
    }, (err: any) => {
      console.log(err);
    })
  }

  selectCustomerDetail(data: any) {
    this.custForm.patchValue({
      pcode: data.PCODE,
      cname: data.CUST_NAME,
      cStatus: data.STATUS,
      cAccountCategory: data.ACCOUNT_CATEGORY_CD,
      cType: data.ACCOUNT_TYPE_CD,
      cCR: data.CR_CPR,
      cTaxNo: data.TAX_1_NO
    });
    this.varpcode = data.PCODE;
    this.getCustmerParty(this.varpcode);
    this.getCustmerInvoices(this.varpcode,this.varsfyear,this.varefyear);
    this.getCustomerMember(this.varpcode);
    this.getAggrementDetails(this.varpcode);
  }

  public gotoContactDetails(url, id) {
    var myurl = `${url}/${id}`;
    this.router.navigateByUrl(myurl).then(e => {
    });
  }

  public gotoMembersDetails(url, id) {
    var myurl = `${url}/${id}`;
    this.router.navigateByUrl(myurl).then(e => {
    });
  }
}