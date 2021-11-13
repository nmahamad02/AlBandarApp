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


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  mYear = '2021';
  pcodeArr : any[] = [];
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
  selectedRowIndex: any = 0;

  constructor(private crmservices:CrmService, public snackbar: MatSnackBar,private dialog:MatDialog) { 
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
    this.crmservices.getPcode(value, this.mYear).subscribe((res: any) => {
      this.pcodeArr = res.recordset;
      this.pcodeDataSource = new MatTableDataSource(this.pcodeArr);
    }, (err: any) => {
      console.log(err);
    })
  }

  highlight(type: string, index: number){
    if(type === "prod"){
      if(index >= 0 && index <= this.pcodeArr.length - 1)
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
