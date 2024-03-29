import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CrmService } from 'src/app/services/crm/crm.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as ExcelJS from  'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';
import { GridOptions } from 'ag-grid-community';
import { ClubserivceService } from 'src/app/services/clubservice/clubserivce.service';
import { UploadService } from 'src/app/services/upload/upload.service';
const EXCEL_EXTENSION = '.xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  @ViewChild('membLookupDialog') membLookupDialog!: TemplateRef<any>;
  @ViewChild('accodeLookupDialog') accodeLookupDialog!: TemplateRef<any>;
  @ViewChild('BoatLookupDialog') BoatLookupDialog!: TemplateRef<any>;

  mMemeberData: any;
  mMemeberprimaryData: any;
  mPrimaryMembers: any[] =[];
  mBoatMembers: any[] =[];
  memberForm: FormGroup;
  nationsArr: any[] = [];
  titlesArr: any[] = [];
  relationArr: any[] = [];
  positionArr: any[] = [];
  membArr: any[] = [];
  accArr: any[] = [];
  boatArr: any[] = [];
  mode: string = 'U';
  mNewMembNbr: string = '';
  columns: any[];
  columnsBoat: any[];
  exportmember : any[] = [];
  openCorporateMembers: boolean = false;
  openFamilyMembers: boolean = false;
  gridApi: any;
  gridColumnApi:any;
  memberList: any[] = [];
  searchValue: any;
  columnMemberDefs: any;
  gridOptions!: Partial<GridOptions>;
  rowStyle!: { background: string; };
  
  utc = new Date();
  mCurDate = this.formatDate(this.utc);
  mCYear = new Date().getFullYear();

  imageSrc: string = '';
  selectedFileToUpload = new File([""], "img");
  errMes: string = '';

  membDisplayedColumns: string[] = ['memberNo', 'memberRefNo', 'title', 'firstname', 'surname', 'cprno'];
  membDataSource = new MatTableDataSource(this.membArr);

  accDisplayedColumns: string[] = ['accode', 'accname'];
  accDataSource = new MatTableDataSource(this.accArr);

  BoatDisplayedColumns: string[] = ['boatid', 'boatname', 'membercode', 'registerno'];
  BoatDataSource = new MatTableDataSource(this.boatArr);

  selectedRowIndex: any = 0;

  constructor(private router: Router, private clubservice: ClubserivceService, private crmservice: CrmService, private lookupservice: LookupService, private dialog: MatDialog, public snackBar: MatSnackBar, private dataService: DataSharingService, private uploadService: UploadService, private route: ActivatedRoute) {
    this.memberForm = new FormGroup({ 
      memberNo: new FormControl('', [Validators.required]),
      memberRefNo: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      image: new FormControl('', []),
      firstname: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      memberType: new FormControl('', [Validators.required]),
      billingCode: new FormControl('', [Validators.required]),
      birthdate: new FormControl('', []),
      relation: new FormControl('Self', []),
      marital: new FormControl('', [Validators.required]),
      add1: new FormControl('', []),
      add2: new FormControl('', []),
      add3: new FormControl('', []), 
      nation: new FormControl('', []),
      telOff: new FormControl('', []),
      telRes: new FormControl('', [Validators.required]),
      faxNbr: new FormControl('', [Validators.required]),
      employer: new FormControl('', []),
      position: new FormControl('', []),
      email: new FormControl('', [Validators.required]),
      insuranceNbr: new FormControl('', []),
      primaryMember: new FormControl('', [Validators.required]),
      cprNbr: new FormControl('', [Validators.required]),
      familyMembers: new FormArray([]),
      corporateMembers: new FormArray([]),
      billingname: new FormControl({ value: 'Billing Name', disabled: true })
    });
    const famMember = new FormGroup({
      dMemberNo: new FormControl('', [Validators.required]),
      dMemberRefNo: new FormControl('', [Validators.required]),
      dTitle: new FormControl('', [Validators.required]),
      dFirstname: new FormControl('', [Validators.required]),
      dSurname: new FormControl('', [Validators.required]),
      dMemberType: new FormControl('S', [Validators.required]),
      dBirthdate: new FormControl('', []),
      dRelation: new FormControl('', []),
      dDob: new FormControl('', []),
      dCprNbr: new FormControl('', [Validators.required])
    });
    this.familyMembers.push(famMember);
    const copMember = new FormGroup({
      dMemberNo: new FormControl('', [Validators.required]),
      dMemberRefNo: new FormControl('', [Validators.required]),
      dTitle: new FormControl('', [Validators.required]),
      dFirstname: new FormControl('', [Validators.required]),
      dSurname: new FormControl('', [Validators.required]),
      dBirthdate: new FormControl('', []),
      dDob: new FormControl('', []),
      dCprNbr: new FormControl('', [Validators.required]),
      dMemberType: new FormControl('', [Validators.required]),
      dRelation: new FormControl('Self', []),
      dTelRes: new FormControl('', []),
      dPosition: new FormControl('', []),
      dEmail: new FormControl('', [Validators.required])
    });
    this.corporateMembers.push(copMember);
    this.getMemberExport();
    this.getMembersPrimaryData();
    this.columns = ["Bill Code","Primary Member","Relation","Member No","Name","Type","Address","Birth Date","Employer","CPR No"];
    this.columnsBoat = ["Boat No","Registration No","Boat Color","Boat Engine No","Boat Name","Model No","Host Power","Insurance No","Registration Expiry","Insurance Expiry date"];

    this.columnMemberDefs = [
      { 
        headername: "Member Code",
        sortable: true ,
        field: "MemberNo", rowGroup: true,
        width: 200
      },
      { 
        headerName: "Member Name", 
        field: 'NAME', 
        width:300, 
        suppressMenu: false, 
        unSortIcon: true,
        sortable: true, 
        tooltipField: "NAME", 
        headerTooltip: "NAME" 
      },
      { 
        headerName: "Member SurName", 
        field: 'DEPT_NAME', 
        width:200, 
        suppressMenu: false, 
        unSortIcon: true,
        sortable: true, 
        tooltipField: "SURNAME", 
        headerTooltip: "SURNAME"
      },
      { 
        headerName: "Member Type", 
        field: 'MEMBTYPE', 
        width:40, 
        suppressMenu: false, 
        unSortIcon: true,
        sortable: true, 
        tooltipField: "MEMBTYPE", 
        headerTooltip: "MEMBTYPE"
      }
    ]
  }

  ngOnInit(): void {
    this.getNations();
    this.getRelations();
    this.getTitles();
    this.getPositions();
    this.getDetails(this.route.snapshot.params.id);
  }

  getMembersPrimaryData() {
    this.crmservice.getExportMemberIsprimary().subscribe((res: any) => {
      this.mMemeberData = res.recordset;
      console.log(this.mMemeberData);
    }, (err: any) => {
      console.log(err);
    })
  }

  getNations(){
    this.lookupservice.getAllNations().subscribe((res: any) => {
      this.nationsArr = res.recordset;
    }, (err: any) => {
      console.log(err);
    })
  }

  getTitles(){
    this.lookupservice.getAllTitles().subscribe((res: any) => {
      this.titlesArr = res.recordset;
    }, (err: any) => {
      console.log(err);
    })
  }

  onViewCellClicked(event: any) {
    this.refreshForm();
    this.memberForm.patchValue({
      memberNo: event.MemberNo,
      memberRefNo: event.REFMEMBNO,
      title: event.TITLE,
      //image: data.IMAGENAME,
      firstname: event.NAME,
      surname: event.SURNAME,
      memberType: event.MEMBTYPE,
      billingCode: event.ACCODE,
      birthdate: event.BIRTHDT,
      relation: event.RELATION,
      marital: event.MARITAL,
      add1: event.ADD1,
      add2: event.ADD2,
      add3: event.ADD3,
      nation: event.NATION,
      telOff: event.TELOFF,
      telRes: event.TELRES,
      faxNbr: event.FAXNO,
      employer: event.EMPLOYER,
      position: event.POSITION,
      email: event.Email,
      insuranceNbr: event.InsuranceNo,
      primaryMember: event.PRIMARYMEMBER,
      cprNbr: event.CPRNo
    });
    this.fillOpbalName(event.ACCODE)
    this.checkDependents(event.MEMBTYPE);
    console.log(event.IMAGENAME);
    var imgVal: string = event.IMAGENAME;
    if (imgVal === "") {
      this.imageSrc = "https://ifaresort-images.s3.me-south-1.amazonaws.com/images/imgNaN.png";
    } else {
      if (imgVal.includes("fakepath")) {
        var imgName: string = imgVal.slice(12);
        console.log(imgName);
        this.imageSrc = "https://ifaresort-images.s3.me-south-1.amazonaws.com/images/" + imgName;
      } else {
        this.imageSrc = "https://ifaresort-images.s3.me-south-1.amazonaws.com/images/" + imgVal;
      }
    }
    console.log(this.imageSrc);
    this.crmservice.getDependentMembers(event.MemberNo).subscribe((res: any) => {
      if (event.MEMBTYPE === 'F') {
        const famArr = res.recordset;
        for (let i = 0; i < famArr.length; i++) {
          const famMember = new FormGroup({
            dMemberNo: new FormControl(famArr[i].MemberNo, [Validators.required]),
            dMemberRefNo: new FormControl(famArr[i].REFMEMBNO, [Validators.required]),
            dTitle: new FormControl(famArr[i].TITLE, [Validators.required]),
            dFirstname: new FormControl(famArr[i].NAME, [Validators.required]),
            dSurname: new FormControl(famArr[i].SURNAME, [Validators.required]),
            dMemberType: new FormControl(famArr[i].MEMBTYPE, [Validators.required]),
            dRelation: new FormControl(famArr[i].RELATION, []),
            dDob: new FormControl(famArr[i].BIRTHDT, []),
            dCprNbr: new FormControl(famArr[i].CPRNo, [Validators.required])
          });
          this.familyMembers.push(famMember);
        }
      }
      else if (event.MEMBTYPE === 'C') {
        const copArr = res.recordset;
        for (let i = 0; i < copArr.length; i++) {
          const copMember = new FormGroup({
            dMemberNo: new FormControl(copArr[i].MemberNo, [Validators.required]),
            dMemberRefNo: new FormControl(copArr[i].REFMEMBNO, [Validators.required]),
            dTitle: new FormControl(copArr[i].TITLE, [Validators.required]),
            dFirstname: new FormControl(copArr[i].NAME, [Validators.required]),
            dSurname: new FormControl(copArr[i].SURNAME, [Validators.required]),
            dDob: new FormControl(copArr[i].BIRTHDT, []),
            dCprNbr: new FormControl(copArr[i].CPRNo, [Validators.required]),
            dMemberType: new FormControl(copArr[i].MEMBTYPE, [Validators.required]),
            dRelation: new FormControl(copArr[i].RELATION, []),
            dTelOff: new FormControl(copArr[i].TELOFF, []),
            dPosition: new FormControl(copArr[i].POSITION, []),
            dEmail: new FormControl(copArr[i].Email, [Validators.required])
          });
          this.corporateMembers.push(copMember);
        }
      }
    })
    let dialogRef = this.dialog.closeAll();
  }

  onGridMemberReady(params: any){ 
    this.gridApi= params.api;
    this.gridColumnApi= params.columnApi;
    this.crmservice.getAllMembersIsPrimary().subscribe((res: any) =>  {
      console.log(this.memberList);
      this.memberList=res.recordset;
      params.api.setRowData(this.memberList);
      console.log(this.memberList);
    }, (error: any) => {
      console.log(error);
    });
  }

  getRelations(){
    this.lookupservice.getAllRelations().subscribe((res: any) => {
      this.relationArr = res.recordset;
    }, (err: any) => {
      console.log(err);
    })
  }

  getMemberExport(){
    this.crmservice.getExprtMembers().subscribe((res: any) => {
      this.mMemeberprimaryData = res.recordset;
    }, (err: any) => {
      console.log(err);
    })
  }

  getPositions(){
    this.lookupservice.getAllPositions().subscribe((res: any) => {
      this.positionArr = res.recordset;
    }, (err: any) => {
      console.log(err);
    })
  }

  lookUpBoat(data: any) {
    const value = data.MemberNo;
    console.log(value)
    this.selectedRowIndex = 0;
    let dialogRef = this.dialog.open(this.BoatLookupDialog);
    this.clubservice.getBoatMasterForMembers(value).subscribe((res: any) => {
      this.boatArr = res.recordset;
      this.BoatDataSource = new MatTableDataSource(this.boatArr);
      console.log(this.boatArr);
    }, (err: any) => {
      console.log(err);
    })
  }

  lookUpMembers(value: string, type: string) {
    this.selectedRowIndex = 0;
    let dialogRef = this.dialog.open(this.membLookupDialog);
    if(type === 'I') { //MEMBERCODE
      this.crmservice.searchMembers(value).subscribe((res: any) => {
        this.membArr = res.recordset;
        this.membDataSource = new MatTableDataSource(this.membArr);
      }, (err: any) => {
        console.log(err);
      })
    } else if(type === 'C') { //CPR
      this.crmservice.searchMemberFromCPR(value).subscribe((res: any) => {
        this.membArr = res.recordset;
        this.membDataSource = new MatTableDataSource(this.membArr);
      }, (err: any) => {
        console.log(err);
      })
    } else if (type === 'N') { //NAME
      this.crmservice.getmembersNameLike(value).subscribe((res: any) => {
        this.membArr = res.recordset;
        this.membDataSource = new MatTableDataSource(this.membArr);
      }, (err: any) => {
        console.log(err);
      })
    } else if (type === 'R') { //MEMBREFNO
      this.crmservice.searchMemberFromREF(value).subscribe((res: any) => {
        this.membArr = res.recordset;
        this.membDataSource = new MatTableDataSource(this.membArr);
      }, (err: any) => {
        console.log(err);
      })
    }
  }

  fillOpbalName(pcode:any) {
    this.selectedRowIndex = 0;
    this.crmservice.searchpcode(pcode).subscribe((res: any) => {
      console.log(res.recordset[0].CUST_NAME)
      this.memberForm.patchValue({
        billingname: res.recordset[0].CUST_NAME
      })
    }, (err: any) => {
      console.log(err);
    })
  }
  
  lookUpAccode(name:any) {
    this.selectedRowIndex = 0;
    let dialogRef = this.dialog.open(this.accodeLookupDialog);
    this.crmservice.getPcodeFromName(name,this.mCYear).subscribe((res: any) => {
      this.accArr = res.recordset;
      this.accDataSource = new MatTableDataSource(this.accArr);
    }, (err: any) => {
      console.log(err);
    })
  }

  getAccode(name:any) {
    this.selectedRowIndex = 0;
    let dialogRef = this.dialog.open(this.accodeLookupDialog);
    this.crmservice.getPcodeFromName(name,this.mCYear).subscribe((res: any) => {
      this.accArr = res.recordset;
      this.accDataSource = new MatTableDataSource(this.accArr);
      this.selectAccode(res.recordset[0]);
    }, (err: any) => {
      console.log(err);
    })
  }

  selectMemb(data: any) {
    this.memberForm.patchValue({
      memberNo: data.MemberNo,
      memberRefNo: data.REFMEMBNO,
      title: data.TITLE,
      //image: data.IMAGENAME,
      firstname: data.NAME,
      surname: data.SURNAME,
      memberType: data.MEMBTYPE,
      billingCode: data.ACCODE,
      birthdate: data.BIRTHDT,
      relation: data.RELATION,
      marital: data.MARITAL,
      add1: data.ADD1,
      add2: data.ADD2,
      add3: data.ADD3, 
      nation: data.NATION,
      telOff: data.TELOFF,
      telRes: data.TELRES,
      faxNbr: data.FAXNO,
      employer: data.EMPLOYER,
      position: data.POSITION,
      email: data.Email,
      insuranceNbr: data.InsuranceNo,
      primaryMember: data.PRIMARYMEMBER,
      cprNbr: data.CPRNo
    });
    this.fillOpbalName(data.ACCODE)
    this.checkDependents(data.MEMBTYPE);
    console.log(data.IMAGENAME);
    var imgVal: string = data.IMAGENAME;
    if (imgVal === "") {
      this.imageSrc = "https://ifaresort-images.s3.me-south-1.amazonaws.com/images/imgNaN.png";
    } else {
      if (imgVal.includes("fakepath")) {
        var imgName: string = imgVal.slice(12);           
        console.log(imgName);
        this.imageSrc = "https://ifaresort-images.s3.me-south-1.amazonaws.com/images/" + imgName;
      } else {
        this.imageSrc = "https://ifaresort-images.s3.me-south-1.amazonaws.com/images/" + imgVal;
      }
    }
    console.log(this.imageSrc);
    this.crmservice.getDependentMembers(data.MemberNo).subscribe((res: any) => {
      if (data.MEMBTYPE === 'F') {
        const famArr = res.recordset;
        for(let i=0; i<famArr.length; i++) {
          const famMember = new FormGroup({
            dMemberNo: new FormControl(famArr[i].MemberNo, [Validators.required]),
            dMemberRefNo: new FormControl(famArr[i].REFMEMBNO, [Validators.required]),
            dTitle: new FormControl(famArr[i].TITLE, [Validators.required]),
            dFirstname: new FormControl(famArr[i].NAME, [Validators.required]),
            dSurname: new FormControl(famArr[i].SURNAME, [Validators.required]),
            dMemberType: new FormControl(famArr[i].MEMBTYPE, [Validators.required]),
            dRelation: new FormControl(famArr[i].RELATION, []),
            dDob: new FormControl(famArr[i].BIRTHDT, []),
            dCprNbr: new FormControl(famArr[i].CPRNo, [Validators.required])
          });
          this.familyMembers.push(famMember);
        }
      }
      else if (data.MEMBTYPE === 'C') {
        const copArr = res.recordset;        
        for(let i=0; i<copArr.length; i++) {
          const copMember = new FormGroup({
            dMemberNo: new FormControl(copArr[i].MemberNo, [Validators.required]),
            dMemberRefNo: new FormControl(copArr[i].REFMEMBNO, [Validators.required]),
            dTitle: new FormControl(copArr[i].TITLE, [Validators.required]),
            dFirstname: new FormControl(copArr[i].NAME, [Validators.required]),
            dSurname: new FormControl(copArr[i].SURNAME, [Validators.required]),
            dDob: new FormControl(copArr[i].BIRTHDT, []),
            dCprNbr: new FormControl(copArr[i].CPRNo, [Validators.required]),
            dMemberType: new FormControl(copArr[i].MEMBTYPE, [Validators.required]),
            dRelation: new FormControl(copArr[i].RELATION, []),
            dTelOff: new FormControl(copArr[i].TELOFF, []),
            dPosition: new FormControl(copArr[i].POSITION, []),
            dEmail: new FormControl(copArr[i].Email, [Validators.required])
          });
          this.corporateMembers.push(copMember);
        }
      }
    })
    let dialogRef = this.dialog.closeAll();
  }

  selectAccode(data: any) {
    console.log(data)
    this.memberForm.patchValue({
      billingCode: data.PCODE,
      billingname: data.CUST_NAME
    });
    let dialogRef = this.dialog.closeAll();
  }

  getMemberData(value:string, condition: string) {
    console.log(value)
    if(condition === 'I') { //MEMBERCODE
      this.crmservice.getMembers(value).subscribe((res: any) => {
        console.log(res);
        const data = res.recordset[0];
        this.mNewMembNbr = data.MemberNo;
        this.memberForm.patchValue({
          memberNo: data.MemberNo,
          memberRefNo: data.REFMEMBNO,
          title: data.TITLE,
          //image: data.IMAGENAME,
          firstname: data.NAME,
          surname: data.SURNAME,
          memberType: data.MEMBTYPE,
          billingCode: data.ACCODE,
          birthdate: data.BIRTHDT,
          relation: data.RELATION,
          marital: data.MARITAL,
          add1: data.ADD1,
          add2: data.ADD2,
          add3: data.ADD3, 
          nation: data.NATION,
          telOff: data.TELOFF,
          telRes: data.TELRES,
          faxNbr: data.FAXNO,
          employer: data.EMPLOYER,
          position: data.POSITION,
          email: data.Email,
          insuranceNbr: data.InsuranceNo,
          primaryMember: data.PRIMARYMEMBER,
          cprNbr: data.CPRNo
        });
        console.log(data.IMAGENAME);
        var imgVal: string = data.IMAGENAME;
        if (imgVal === "") {
          this.imageSrc = "https://ifaresort-images.s3.me-south-1.amazonaws.com/images/imgNaN.png";
        } else {
          if (imgVal.includes("fakepath")) {
            var imgName: string = imgVal.slice(12);
            console.log(imgName);
            this.imageSrc = "https://ifaresort-images.s3.me-south-1.amazonaws.com/images/" + imgName;
          } else {
            this.imageSrc = "https://ifaresort-images.s3.me-south-1.amazonaws.com/images/" + imgVal;
          }
        }
        console.log(this.imageSrc);
        this.fillOpbalName(data.ACCODE)
        this.checkDependents(data.MEMBTYPE);
        this.crmservice.getDependentMembers(data.MemberNo).subscribe((res: any) => {
          if (data.MEMBTYPE === 'F') {
            const famArr = res.recordset;
            for(let i=0; i<famArr.length; i++) {
              const famMember = new FormGroup({
                dMemberNo: new FormControl(famArr[i].MemberNo, [Validators.required]),
                dMemberRefNo: new FormControl(famArr[i].REFMEMBNO, [Validators.required]),
                dTitle: new FormControl(famArr[i].TITLE, [Validators.required]),
                dFirstname: new FormControl(famArr[i].NAME, [Validators.required]),
                dSurname: new FormControl(famArr[i].SURNAME, [Validators.required]),
                dMemberType: new FormControl(famArr[i].MEMBTYPE, [Validators.required]),
                dRelation: new FormControl(famArr[i].RELATION, []),
                dDob: new FormControl(famArr[i].BIRTHDT, []),
                dCprNbr: new FormControl(famArr[i].CPRNo, [Validators.required])
              });
              this.familyMembers.push(famMember);
            }
          }
          else if (data.MEMBTYPE === 'C') {
            const copArr = res.recordset;        
            for(let i=0; i<copArr.length; i++) {
              const copMember = new FormGroup({
                dMemberNo: new FormControl(copArr[i].MemberNo, [Validators.required]),
                dMemberRefNo: new FormControl(copArr[i].REFMEMBNO, [Validators.required]),
                dTitle: new FormControl(copArr[i].TITLE, [Validators.required]),
                dFirstname: new FormControl(copArr[i].NAME, [Validators.required]),
                dSurname: new FormControl(copArr[i].SURNAME, [Validators.required]),
                dDob: new FormControl(copArr[i].BIRTHDT, []),
                dCprNbr: new FormControl(copArr[i].CPRNo, [Validators.required]),
                dMemberType: new FormControl(copArr[i].MEMBTYPE, [Validators.required]),
                dRelation: new FormControl(copArr[i].RELATION, []),
                dTelOff: new FormControl(copArr[i].TELOFF, []),
                dPosition: new FormControl(copArr[i].POSITION, []),
                dEmail: new FormControl(copArr[i].Email, [Validators.required])
              });
              this.corporateMembers.push(copMember);
            }
          }
        })
      }, (err: any) => {
        console.log(err);
      })
    } else if (condition === 'R') { //MEMBREFNO
      this.crmservice.getMemberFromREF(value).subscribe((res: any) => {
        console.log(res);
        const data = res.recordset[0];
        this.mNewMembNbr = data.MemberNo;
        this.memberForm.patchValue({
          memberNo: data.MemberNo,
          memberRefNo: data.REFMEMBNO,
          title: data.TITLE,
          //image: data.IMAGENAME,
          firstname: data.NAME,
          surname: data.SURNAME,
          memberType: data.MEMBTYPE,
          billingCode: data.ACCODE,
          birthdate: data.BIRTHDT,
          relation: data.RELATION,
          marital: data.MARITAL,
          add1: data.ADD1,
          add2: data.ADD2,
          add3: data.ADD3, 
          nation: data.NATION,
          telOff: data.TELOFF,
          telRes: data.TELRES,
          faxNbr: data.FAXNO,
          employer: data.EMPLOYER,
          position: data.POSITION,
          email: data.Email,
          insuranceNbr: data.InsuranceNo,
          primaryMember: data.PRIMARYMEMBER,
          cprNbr: data.CPRNo
        });
        console.log(data.IMAGENAME);
        var imgVal: string = data.IMAGENAME;
        if (imgVal === "") {
          this.imageSrc = "https://ifaresort-images.s3.me-south-1.amazonaws.com/images/imgNaN.png";
        } else {
          if (imgVal.includes("fakepath")) {
            var imgName: string = imgVal.slice(12);
            console.log(imgName);
            this.imageSrc = "https://ifaresort-images.s3.me-south-1.amazonaws.com/images/" + imgName;
          } else {
            this.imageSrc = "https://ifaresort-images.s3.me-south-1.amazonaws.com/images/" + imgVal;
          }
        }
        console.log(this.imageSrc);
        this.fillOpbalName(data.ACCODE);
        this.checkDependents(data.MEMBTYPE);
        this.crmservice.getDependentMembers(data.MemberNo).subscribe((res: any) => {
          if (data.MEMBTYPE === 'F') {
            const famArr = res.recordset;
            for(let i=0; i<famArr.length; i++) {
              const famMember = new FormGroup({
                dMemberNo: new FormControl(famArr[i].MemberNo, [Validators.required]),
                dMemberRefNo: new FormControl(famArr[i].REFMEMBNO, [Validators.required]),
                dTitle: new FormControl(famArr[i].TITLE, [Validators.required]),
                dFirstname: new FormControl(famArr[i].NAME, [Validators.required]),
                dSurname: new FormControl(famArr[i].SURNAME, [Validators.required]),
                dMemberType: new FormControl(famArr[i].MEMBTYPE, [Validators.required]),
                dRelation: new FormControl(famArr[i].RELATION, []),
                dDob: new FormControl(famArr[i].BIRTHDT, []),
                dCprNbr: new FormControl(famArr[i].CPRNo, [Validators.required])
              });
              this.familyMembers.push(famMember);
            }
          }
          else if (data.MEMBTYPE === 'C') {
            const copArr = res.recordset;        
            for(let i=0; i<copArr.length; i++) {
              const copMember = new FormGroup({
                dMemberNo: new FormControl(copArr[i].MemberNo, [Validators.required]),
                dMemberRefNo: new FormControl(copArr[i].REFMEMBNO, [Validators.required]),
                dTitle: new FormControl(copArr[i].TITLE, [Validators.required]),
                dFirstname: new FormControl(copArr[i].NAME, [Validators.required]),
                dSurname: new FormControl(copArr[i].SURNAME, [Validators.required]),
                dDob: new FormControl(copArr[i].BIRTHDT, []),
                dCprNbr: new FormControl(copArr[i].CPRNo, [Validators.required]),
                dMemberType: new FormControl(copArr[i].MEMBTYPE, [Validators.required]),
                dRelation: new FormControl(copArr[i].RELATION, []),
                dTelOff: new FormControl(copArr[i].TELOFF, []),
                dPosition: new FormControl(copArr[i].POSITION, []),
                dEmail: new FormControl(copArr[i].Email, [Validators.required])
              });
              this.corporateMembers.push(copMember);
            }
          }
        })
      }, (err: any) => {
        console.log(err);
      })
    } else if (condition === 'C') { //CPR
      this.crmservice.getMemberFromCPR(value).subscribe((res: any) => {
        console.log(res);
        const data = res.recordset[0];
        this.mNewMembNbr = data.MemberNo;
        this.memberForm.patchValue({
          memberNo: data.MemberNo,
          memberRefNo: data.REFMEMBNO,
          title: data.TITLE,
          //image: data.IMAGENAME,
          firstname: data.NAME,
          surname: data.SURNAME,
          memberType: data.MEMBTYPE,
          billingCode: data.ACCODE,
          birthdate: data.BIRTHDT,
          relation: data.RELATION,
          marital: data.MARITAL,
          add1: data.ADD1,
          add2: data.ADD2,
          add3: data.ADD3, 
          nation: data.NATION,
          telOff: data.TELOFF,
          telRes: data.TELRES,
          faxNbr: data.FAXNO,
          employer: data.EMPLOYER,
          position: data.POSITION,
          email: data.Email,
          insuranceNbr: data.InsuranceNo,
          primaryMember: data.PRIMARYMEMBER,
          cprNbr: data.CPRNo
        });
        console.log(data.IMAGENAME);
        var imgVal: string = data.IMAGENAME;
        if (imgVal === "") {
          this.imageSrc = "https://ifaresort-images.s3.me-south-1.amazonaws.com/images/imgNaN.png";
        } else {
          if (imgVal.includes("fakepath")) {
            var imgName: string = imgVal.slice(12);
            console.log(imgName);
            this.imageSrc = "https://ifaresort-images.s3.me-south-1.amazonaws.com/images/" + imgName;
          } else {
            this.imageSrc = "https://ifaresort-images.s3.me-south-1.amazonaws.com/images/" + imgVal;
          }
        }
        console.log(this.imageSrc);
        this.fillOpbalName(data.ACCODE)
        this.checkDependents(data.MEMBTYPE);
        this.crmservice.getDependentMembers(data.MemberNo).subscribe((res: any) => {
          if (data.MEMBTYPE === 'F') {
            const famArr = res.recordset;
            for(let i=0; i<famArr.length; i++) {
              const famMember = new FormGroup({
                dMemberNo: new FormControl(famArr[i].MemberNo, [Validators.required]),
                dMemberRefNo: new FormControl(famArr[i].REFMEMBNO, [Validators.required]),
                dTitle: new FormControl(famArr[i].TITLE, [Validators.required]),
                dFirstname: new FormControl(famArr[i].NAME, [Validators.required]),
                dSurname: new FormControl(famArr[i].SURNAME, [Validators.required]),
                dMemberType: new FormControl(famArr[i].MEMBTYPE, [Validators.required]),
                dRelation: new FormControl(famArr[i].RELATION, []),
                dDob: new FormControl(famArr[i].BIRTHDT, []),
                dCprNbr: new FormControl(famArr[i].CPRNo, [Validators.required])
              });
              this.familyMembers.push(famMember);
            }
          }
          else if (data.MEMBTYPE === 'C') {
            const copArr = res.recordset;        
            for(let i=0; i<copArr.length; i++) {
              const copMember = new FormGroup({
                dMemberNo: new FormControl(copArr[i].MemberNo, [Validators.required]),
                dMemberRefNo: new FormControl(copArr[i].REFMEMBNO, [Validators.required]),
                dTitle: new FormControl(copArr[i].TITLE, [Validators.required]),
                dFirstname: new FormControl(copArr[i].NAME, [Validators.required]),
                dSurname: new FormControl(copArr[i].SURNAME, [Validators.required]),
                dDob: new FormControl(copArr[i].BIRTHDT, []),
                dCprNbr: new FormControl(copArr[i].CPRNo, [Validators.required]),
                dMemberType: new FormControl(copArr[i].MEMBTYPE, [Validators.required]),
                dRelation: new FormControl(copArr[i].RELATION, []),
                dTelOff: new FormControl(copArr[i].TELOFF, []),
                dPosition: new FormControl(copArr[i].POSITION, []),
                dEmail: new FormControl(copArr[i].Email, [Validators.required])
              });
              this.corporateMembers.push(copMember);
            }
          }
        })
      }, (err: any) => {
        console.log(err);
      })
    }
  }

  checkDependents(memberType: string) {
    if (memberType === 'S') {
      this.openFamilyMembers = false;
      this.openCorporateMembers = false;
    } 
    else if (memberType === 'F') {
      this.openFamilyMembers = true;
      this.openCorporateMembers = false;
    }
    else if (memberType === 'C') {
      this.openCorporateMembers = true;
      this.openFamilyMembers = false;
    }
  }

  addDependentMember(type: string,) {
    if (type === 'F') {
      const index = this.familyMembers.length + 1;
      const newMembNbr = this.mNewMembNbr + '-' + index.toString();
      const famMember = new FormGroup({
        dMemberNo: new FormControl(newMembNbr, [Validators.required]),
        dMemberRefNo: new FormControl('', [Validators.required]),
        dTitle: new FormControl('', [Validators.required]),
        dFirstname: new FormControl('', [Validators.required]),
        dSurname: new FormControl('', [Validators.required]),
        dMemberType: new FormControl('S', [Validators.required]),
        dRelation: new FormControl('', []),
        dDob: new FormControl('', []),
        dCprNbr: new FormControl('', [Validators.required])
      });
      this.familyMembers.push(famMember);
    }
    else if (type === 'C') {
      const index = this.corporateMembers.length + 1;
      const newMembNbr = this.mNewMembNbr + '-' + index.toString();
      const copMember = new FormGroup({
        dMemberNo: new FormControl(newMembNbr, [Validators.required]),
        dMemberRefNo: new FormControl('', [Validators.required]),
        dTitle: new FormControl('', [Validators.required]),
        dFirstname: new FormControl('', [Validators.required]),
        dSurname: new FormControl('', [Validators.required]),
        dDob: new FormControl('', []),
        dCprNbr: new FormControl('', [Validators.required]),
        dMemberType: new FormControl('', [Validators.required]),
        dRelation: new FormControl('Self', []),
        dTelOff: new FormControl('', []),
        dPosition: new FormControl('', []),
        dEmail: new FormControl('', [Validators.required])
      });
      this.corporateMembers.push(copMember);
    }
  }

  deleteDependentMember(type: string, index: number) {
    if (type === 'F') {
      if(this.familyMembers.length === 1){
        console.log(this.familyMembers)
      } else {
        this.familyMembers.removeAt(index);
      }
    }
    else if (type === 'C') {
      if(this.corporateMembers.length === 1){
        console.log(this.corporateMembers)
      } else {
        this.corporateMembers.removeAt(index);
      }
    }
  }
  
  get f(){
    return this.memberForm.controls;
  }

  get familyMembers(): FormArray {
    return this.memberForm.get('familyMembers') as FormArray
  }

  get corporateMembers(): FormArray {
    return this.memberForm.get('corporateMembers') as FormArray
  }

  refreshForm() {
    this.imageSrc = '';
    this.mode = 'U';
    this.mNewMembNbr = '';
    this.openFamilyMembers = false;
    this.openCorporateMembers = false;
    this.memberForm = new FormGroup({ 
      memberNo: new FormControl('', [Validators.required]),
      memberRefNo: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      image: new FormControl('', []),
      firstname: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      memberType: new FormControl('', [Validators.required]),
      billingCode: new FormControl('', [Validators.required]),
      billingname: new FormControl({ value: 'Billing Name', disabled: true }),
      birthdate: new FormControl('', []),
      relation: new FormControl('Self', []),
      marital: new FormControl('', [Validators.required]),
      add1: new FormControl('', []),
      add2: new FormControl('', []),
      add3: new FormControl('', []), 
      nation: new FormControl('', []),
      telOff: new FormControl('', []),
      telRes: new FormControl('', [Validators.required]),
      faxNbr: new FormControl('', [Validators.required]),
      employer: new FormControl('', []),
      position: new FormControl('', []),
      email: new FormControl('', [Validators.required]),
      insuranceNbr: new FormControl('', []),
      primaryMember: new FormControl('', [Validators.required]),
      cprNbr: new FormControl('', [Validators.required]),
      familyMembers: new FormArray([]),
      corporateMembers: new FormArray([])
    });
  }

  newForm() {
    this.imageSrc = '';
    this.mode = 'I';
    this.openFamilyMembers = false;
    this.openCorporateMembers = false;
    const year = String(this.mCYear);
    this.crmservice.getDocForMemb(year).subscribe((res: any) => {
      //const yearStr = String(res.recordset[0].CYEAR).substring(2);
      const docNbr = res.recordset[0].FIELD_VALUE_NM + 1;
      this.mNewMembNbr = docNbr.toString();
      this.memberForm = new FormGroup({ 
        memberNo: new FormControl(this.mNewMembNbr, [Validators.required]),
        memberRefNo: new FormControl('', [Validators.required]),
        title: new FormControl('', [Validators.required]),
        image: new FormControl('', []),
        firstname: new FormControl('', [Validators.required]),
        surname: new FormControl('', [Validators.required]),
        memberType: new FormControl('', [Validators.required]),
        billingCode: new FormControl('', [Validators.required]),
        birthdate: new FormControl('', []),
        relation: new FormControl('Self', []),
        marital: new FormControl('', [Validators.required]),
        add1: new FormControl('', []),
        add2: new FormControl('', []),
        add3: new FormControl('', []), 
        nation: new FormControl('', []),
        telOff: new FormControl('', []),
        telRes: new FormControl('', [Validators.required]),
        faxNbr: new FormControl('', [Validators.required]),
        employer: new FormControl('', []),
        position: new FormControl('', []),
        email: new FormControl('', [Validators.required]),
        insuranceNbr: new FormControl('', []),
        primaryMember: new FormControl('', [Validators.required]),
        cprNbr: new FormControl('', [Validators.required]),
        familyMembers: new FormArray([]),
        corporateMembers: new FormArray([])
      });
    }, (err: any) => {
      console.log(err)
    })
    /*const famMember = new FormGroup({
      dMemberNo: new FormControl('***NEW***', [Validators.required]),
      dMemberRefNo: new FormControl('', [Validators.required]),
      dTitle: new FormControl('', [Validators.required]),
      dFirstname: new FormControl('', [Validators.required]),
      dSurname: new FormControl('', [Validators.required]),
      dMemberType: new FormControl('S', [Validators.required]),
      dRelation: new FormControl('', []),
      dDob: new FormControl('', []),
      dCprNbr: new FormControl('', [Validators.required])
    });
    this.familyMembers.push(famMember);
    const copMember = new FormGroup({
      dMemberNo: new FormControl('***NEW***', [Validators.required]),
      dMemberRefNo: new FormControl('', [Validators.required]),
      dTitle: new FormControl('', [Validators.required]),
      dFirstname: new FormControl('', [Validators.required]),
      dSurname: new FormControl('', [Validators.required]),
      dDob: new FormControl('', []),
      dCprNbr: new FormControl('', [Validators.required]),
      dMemberType: new FormControl('', [Validators.required]),
      dRelation: new FormControl('Self', []),
      dTelRes: new FormControl('', []),
      dPosition: new FormControl('', []),
      dEmail: new FormControl('', [Validators.required])
    });
    this.corporateMembers.push(copMember);*/
  }
    
  quickMemberSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  onFileChange(event: any) {
    var filesList: FileList = event.target.files;
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const fileToUpload: any = filesList.item(0);
      console.log(fileToUpload.name);
      const imgNm: string = fileToUpload.name;
      console.log(imgNm);
      reader.readAsDataURL(fileToUpload);
      reader.onload = () => {
          this.imageSrc = reader.result as string;
          this.memberForm.patchValue({
            //image: reader.result
            image: imgNm
          });
      };
      this.selectedFileToUpload = fileToUpload;
    }
  }

  uploadImage() {
    if (!this.selectedFileToUpload) {
      alert('Please select a file first!'); // or any other message to the user to choose a file
      return;
    } else {
      console.log('attempt to upload')
      this.uploadService.uploadImage(this.selectedFileToUpload);
    }
  }

  submitForm() {
    const data = this.memberForm.value;
    console.log(data);
    if (this.mode === 'I') {
      this.crmservice.postNewMember(data.memberNo, data.memberRefNo,data.title, data.firstname, data.surname, data.memberType, this.formatDate(data.birthdate), data.marital, data.add1, data.add2, data.add3, data.nation, data.telOff, data.telRes, data.faxNbr, data.employer, data.position, 'Y', data.relation, data.image, data.primaryMember, data.email, this.mCurDate, data.insuranceNbr, data.cprNbr, data.billingCode).subscribe((res: any) => {
        console.log(res);
        this.crmservice.getMemberFromCPR(data.cprNbr).subscribe((res: any) => {
          const pM = res.recordset[0].MemberNo;
          this.uploadImage();
          console.log(pM);
          if (data.memberType === 'F') {
             for(let i=0; i<data.familyMembers.length; i++) {
              this.crmservice.postNewMember(data.familyMembers[i].dMemberNo, data.familyMembers[i].dMemberRefNo,data.familyMembers[i].dTitle, data.familyMembers[i].dFirstname, data.familyMembers[i].dSurname, data.familyMembers[i].dMemberType, this.formatDate(data.familyMembers[i].dDob), '', data.add1, data.add2, data.add3, data, data.telOff, data.telRes, data.faxNbr, '', '', 'N', data.familyMembers[i].dRelation, '', pM, data.email, this.mCurDate, data.insuranceNbr, data.familyMembers[i].dCprNbr, data.billingCode).subscribe((res: any) => {
                console.log(res);
              }, (err: any) => {
                console.log(err);
              });
            }
          }
          else if (data.memberType === 'C') {
            for(let i=0; i<data.corporateMembers.length; i++) {
              this.crmservice.postNewMember(data.corporateMembers[i].dMemberNo, data.corporateMembers[i].dMemberRefNo,data.corporateMembers[i].dTitle, data.corporateMembers[i].dFirstname, data.corporateMembers[i].dSurname, data.corporateMembers[i].dMemberType, this.formatDate(data.corporateMembers[i].dDob), '', data.add1, data.add2, data.add3, data.nation, data.telOff, data.corporateMembers[i].dTelRes, data.faxNbr, '', data.corporateMembers[i].dPosition, 'Y', data.corporateMembers[i].dRelation, '', pM, data.corporateMembers[i].dEmail, this.mCurDate, data.insuranceNbr, data.corporateMembers[i].dCprNbr, data.billingCode).subscribe((res: any) => {
                console.log(res);
              }, (err: any) => {
                console.log(err);
              });
            }
          }
          if (data.memberType === 'S'){
            this.snackBar.open(pM + " successfully inserted", "close", {
              duration: 10000,
              verticalPosition: 'top',
              panelClass: ['sbBg']
            });
          } else {
            this.snackBar.open(pM + " and it's dependents successfully inserted", "close", {
              duration: 10000,
              verticalPosition: 'top',
              panelClass: ['sbBg']
            });
          }
          this.getMemberData(pM, 'I');
          this.crmservice.updateDocForMemb(pM, String(this.mCYear));
        }, (err: any) => {
          console.log(err);
        })
      }, (err: any) => {
        console.log(err);
      })
      this.refreshForm();
      //this.getMemberData(data.memberNo,'I');
    } else {
      this.crmservice.updateMember(data.memberRefNo,data.memberNo, data.title, data.firstname, data.surname, data.memberType, this.formatDate(data.birthdate), data.marital, data.add1, data.add2, data.add3, data.nation, data.telOff, data.telRes, data.faxNbr, data.employer, data.position, 'Y', data.relation, data.image, data.primaryMember, data.email, this.mCurDate, data.insuranceNbr, data.cprNbr, data.billingCode).subscribe((res: any) => {
        console.log(res);
        this.uploadImage();
        this.crmservice.deleteDepMembers(data.memberNo).subscribe((resp: any) => {
          console.log(resp);
          if (data.memberType === 'F') {
            for(let i=0; i<data.familyMembers.length; i++) {
              this.crmservice.postNewMember(data.familyMembers[i].dMemberNo, data.familyMembers[i].dMemberRefNo,data.familyMembers[i].dTitle, data.familyMembers[i].dFirstname, data.familyMembers[i].dSurname, data.familyMembers[i].dMemberType, this.formatDate(data.familyMembers[i].dDob), '', data.add1, data.add2, data.add3, data.nation, data.telOff, data.telRes, data.faxNbr, '', '', 'N', data.familyMembers[i].dRelation, '', data.memberNo, data.email, this.mCurDate, data.insuranceNbr, data.familyMembers[i].dCprNbr, data.billingCode).subscribe((response: any) => {
                console.log(response);
              }, (err: any) => {
                console.log(err);
              });
            }
          }
          else if (data.memberType === 'C') {
            for(let i=0; i<data.corporateMembers.length; i++) {
              this.crmservice.postNewMember(data.corporateMembers[i].dMemberNo, data.familyMembers[i].dMemberRefNo,data.corporateMembers[i].dTitle, data.corporateMembers[i].dFirstname, data.corporateMembers[i].dSurname, data.corporateMembers[i].dMemberType, this.formatDate(data.corporateMembers[i].dDob), '', data.add1, data.add2, data.add3, data.nation, data.telOff, data.corporateMembers[i].dTelRes, data.faxNbr, '', data.corporateMembers[i].dPosition, 'Y', data.corporateMembers[i].dRelation, '', data.memberNo, data.corporateMembers[i].dEmail, this.mCurDate, data.insuranceNbr, data.corporateMembers[i].dCprNbr, data.billingCode).subscribe((response: any) => {
                console.log(response);
              }, (err: any) => {
                console.log(err);
              });
            }
          }
        }, (error: any) => {
          console.log(error);
        });
      }, (errrr: any) => {
        console.log(errrr);
      })
      
      this.snackBar.open(data.memberNo + " successfully Updated", "close", {
        duration: 10000,
        verticalPosition: 'top',
        panelClass: ['sbBg']
      });
      this.refreshForm();
      //this.getMemberData(data.memberNo,'I');
    }
  }

  numToAlpha(num: number) {
    let alpha = '';
    for (; num >=0; num = parseInt((num / 26).toString(),10)-1){
      alpha = String.fromCharCode(num %  26 + 0x41) + alpha;
    }
    return alpha;
  }

  printForm(){

  }

  getDetails(value: any) {
    /*const data = this.memberForm.value;
    this.dataService.setData(data);
    this.router.navigate(['/crm/member/details']);*/

    if(value === 'new') {
      this.newForm();
    } else {
      this.crmservice.getMembers(value).subscribe((res: any) => {
        const data = res.recordset[0];
        this.onViewCellClicked(data);
      }, (err: any) => {
        console.log(err);
      })
    }
  }

  highlight(type: string, index: number){
    console.log(index);
    if (type === "membs") {
      if(index >= 0 && index <= this.membArr.length - 1)
      this.selectedRowIndex = index;
    } else if (type === "accs") {
      if(index >= 0 && index <= this.accArr.length - 1)
      this.selectedRowIndex = index;
    }
  }

  arrowUpEvent(type: string, index: number){
   this.highlight(type, --index);
  }

  arrowDownEvent(type: string, index: number){
    this.highlight(type, ++index);
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
