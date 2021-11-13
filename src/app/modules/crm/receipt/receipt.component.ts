import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CrmService } from 'src/app/services/crm/crm.service';
import { FinanceService } from 'src/app/services/finance/finance.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {

  @ViewChild('VoucerLookUpDailouge') VoucerLookUpDailouge!: TemplateRef<any>;
  @ViewChild('opbalLookupDialog') opbalLookupDialog!: TemplateRef<any>;
  @ViewChild('DebitAccountLookupDialog') DebitAccountLookupDialog!: TemplateRef<any>;

  ReceiptVoucherForm: FormGroup;
  paymenttypeArr: any[] = [];
  bankdetailArr: any[] = [];
  selectedRowIndex: any = 0;
  vochArr: any[] = [];  
  opbalArr: any[] = [];
  debitAccArr: any[] = [];
  mVoochNo = '';
  mYear = '2021';

  payeetype: any;
  refNo: any;
  refdate = '';
  bank: any;
  opbalIndex: number = 0;
  mPcode = '';
  mDebitAccount = '';
  mNewRvNo = '';
  utc = new Date();
  mCurDate = this.formatDate(this.utc);

  vochDisplayedColumns: string[] = ['trnno', 'invno', 'amount', 'lname', 'refno', 'narration'];
  vochDataSource = new MatTableDataSource(this.vochArr);

  opbalDisplayedColumns: string[] = ['pcode', 'name', 'glcode', 'opbal'];
  opbalDataSource = new MatTableDataSource(this.opbalArr);

  debitAccountDisplayedColumns: string[] = ['pcode', 'name', 'glcode', 'opbal'];
  DebitAccountDataSource = new MatTableDataSource(this.debitAccArr);

  constructor(private crmservice: CrmService,private dailog:MatDialog,public snackBar: MatSnackBar,private financeservice: FinanceService) {
    this.ReceiptVoucherForm = new FormGroup({
      rptVoucher: new FormControl('', []),
      rptVoucherDate: new FormControl('', []),
      rptPaymentType: new FormControl('', []),
      rptDebitAccount: new FormControl('', []),
      rptAccountDescription: new FormControl('', []),
      rptItemArray: new FormArray([]),
      rptRefNo: new FormControl('', []),
      rptRefDate: new FormControl('', []),
      rptBank: new FormControl('', []),
      rptName: new FormControl('', []),
      rptNarration: new FormControl('', []),
      rptCurrency: new FormControl('', []),
      rptExchRate: new FormControl('', []), 
    })
   }

  ngOnInit(): void {
    this.getpayType();
    this.getAllBankDetails();
  }

  getpayType(){
    this.crmservice.getPaymentType().subscribe((res: any) => {
      this.paymenttypeArr = res.recordset;
    }, (err: any) => {
      console.log(err);
    })
  }

  getAllBankDetails(){
    this.crmservice.getAllBank().subscribe((res: any) => {
      this.bankdetailArr = res.recordset;
    }, (err: any) => {
      console.log(err);
    })
  }

  addrptItem() {
    // const lastInd = this.rptItems.length - 1;
    // const lastEle = this.rptItems.at(lastInd).value;
    // if(lastEle.rptAccontcode === "") {
    //   console.log(lastEle.rptAccontcode);
    // } else {
      const rptVoucerGrid = new FormGroup({
        rptAccontcode: new FormControl('', [ Validators.required]),
        rptAccountName: new FormControl('', [ Validators.required]),
        rptDescription: new FormControl('', [ Validators.required]),
        rptcreditAmount: new FormControl('', [ Validators.required]),
        rptAllocation: new FormControl('', [ Validators.required]),
      });
      this.rptItems.push(rptVoucerGrid);
      //this.siItem.last.nativeElement.focus();
    // }
  }

  deleteSIItem(index: number) {
    if(this.rptItems.length === 1){
      console.log(this.rptItems)
    } else {
      this.rptItems.removeAt(index);
    }
    //this.siItem.last.nativeElement.focus();
  }

  get rptItems(): FormArray {
    return this.ReceiptVoucherForm.get('rptItemArray') as FormArray
  }

  lookUpVoucher(value: string) {
    console.log(value)
    this.selectedRowIndex = 0;
    let dialogRef = this.dailog.open(this.VoucerLookUpDailouge);    
    this.crmservice.getTranHead(value, this.mYear).subscribe((res: any) => {
      this.vochArr = res.recordset;
      this.vochDataSource = new MatTableDataSource(this.vochArr);
      console.log(res.recordset);
    }, (err: any) => {
      console.log(err);
    })
  }

  lookUpDebitAcc(value: string) {
    console.log(value);
    this.selectedRowIndex = 0;
    let dialogRef = this.dailog.open(this.DebitAccountLookupDialog);    
    this.crmservice.searchOpbalDebitAccount(value).subscribe((res: any) => {
      this.debitAccArr = res.recordset;
      this.DebitAccountDataSource = new MatTableDataSource(this.debitAccArr);
    }, (err: any) => {
      console.log(err);
    })
  }

  searchDebitAccount(pcode: any) {
    this.crmservice.searchOpbalDebitAccount(pcode).subscribe((res: any) => {
      this.selectDebitAcc(res.recordset[0]);
    }, (err: any) => {
      console.log(err);
    })
  }


  highlight(type: string, index: number){
    if (type === "voch") {
      if(index >= 0 && index <= this.vochArr.length - 1)
      this.selectedRowIndex = index;
    }else if (type === "opbal") {
      if(index >= 0 && index <= this.opbalArr.length - 1)
      this.selectedRowIndex = index;
  }else if (type === "debitAcc") {
    if(index >= 0 && index <= this.debitAccArr.length - 1)
    this.selectedRowIndex = index;
  }
}

checkopbal(productCode: string, index: number) {
  this.mPcode = productCode;
  this.opbalIndex = index;      
  const data = this.ReceiptVoucherForm.value;
  this.crmservice.getAllOpbal(productCode, this.mYear).subscribe((res: any) => {
    const rowData: any = {
      rptAccountName: res.recordset[0].CUST_NAME,
      rptDescription: data.rptNarration,
      rptcreditAmount: res.recordset[0].CR_BAL,
      rptAllocation: res.recordset[0].OPBAL,
    }
    this.mPcode = res.recordset[0].PCODE;
    this.rptItems.at(index).patchValue(rowData);
    console.log(res);
  }, (err: any) => {
    console.log(err);
  })
}



newForm() {
  this.ReceiptVoucherForm = new FormGroup({
      rptVoucher: new FormControl('***NEW***', []),
      rptVoucherDate: new FormControl('', [Validators.required]),
      rptPaymentType: new FormControl('', [Validators.required]),
      rptDebitAccount: new FormControl('', [Validators.required]),
      rptAccountDescription: new FormControl('', [Validators.required]),
      rptItemArray: new FormArray([]),
      rptRefNo: new FormControl('', []),
      rptRefDate: new FormControl('', []),
      rptBank: new FormControl('', []),
      rptName: new FormControl('', [Validators.required]),
      rptNarration: new FormControl('', [Validators.required]),
      rptCurrency: new FormControl('', []),
      rptExchRate: new FormControl('', [Validators.required]), 
  });
  this.opbalIndex = 0;
  this.mYear = '2021';
  this.mVoochNo= '';
  const rptVoucerGrid = new FormGroup({
    rptAccontcode: new FormControl('', [ Validators.required]),
        rptAccountName: new FormControl('', [ Validators.required]),
        rptDescription: new FormControl('', [ Validators.required]),
        rptcreditAmount: new FormControl('', [ Validators.required]),
        rptAllocation: new FormControl('', [ Validators.required]),
  });
  this.rptItems.push(rptVoucerGrid);
}

refreshForm() {
  this.ReceiptVoucherForm = new FormGroup({
    rptVoucher: new FormControl('', []),
    rptVoucherDate: new FormControl('', [Validators.required]),
    rptPaymentType: new FormControl('', [Validators.required]),
    rptDebitAccount: new FormControl('', [Validators.required]),
    rptAccountDescription: new FormControl('', [Validators.required]),
    rptItemArray: new FormArray([]),
    rptRefNo: new FormControl('', []),
    rptRefDate: new FormControl('', []),
    rptBank: new FormControl('', []),
    rptName: new FormControl('', [Validators.required]),
    rptNarration: new FormControl('', [Validators.required]),
    rptCurrency: new FormControl('', []),
    rptExchRate: new FormControl('', [Validators.required]), 
});
this.opbalIndex = 0;
this.mYear = '2021';
this.mVoochNo = '';
}

selectOpbal(obj: any) {
  console.log(obj.PCODE);
  console.log(this.opbalIndex);
  this.checkopbal(obj.PCODE, this.opbalIndex);
  const rowData: any = {
    rptAccontcode: obj.PCODE
  }
  this.rptItems.at(this.opbalIndex).patchValue(rowData);
  let dialogRef = this.dailog.closeAll();
}

selectDebitAcc(obj: any) {
  this.ReceiptVoucherForm.patchValue({
    rptDebitAccount: obj.PCODE,
    rptAccountDescription: obj.CUST_NAME,
  })
}

  searchVocher(trnno: any) {
    this.crmservice.getTranHead(trnno, this.mYear).subscribe((res: any) => {
      this.selectSiv(res.recordset[0]);
      console.log(res.recordset)
    }, (err: any) => {
      console.log(err);
    })
  }

  arrowUpEvent(type: string, index: number){
    this.highlight(type, --index);
   }

   lookupOpbal(value: string, type: string, index: number) {
    this.selectedRowIndex = 0;
    let dialogRef = this.dailog.open(this.opbalLookupDialog);
    if (type === "opbal") {
      this.crmservice.getSearchOpbal(value, this.mYear).subscribe((res: any)=> {
        this.opbalArr = res.recordset;
        this.opbalDataSource = new MatTableDataSource(this.opbalArr);
        this.opbalIndex = index;      
      }, (err: any) => {
        console.log(err);
      })
    } 
  }
 
  onFormSubmit(){
    const data = this.ReceiptVoucherForm.value;

    if(data.rptVoucher == '***NEW***'){
      this.crmservice.getRVDocNo(this.mYear).subscribe((res: any)=> {
        this.mNewRvNo = res.recordset[0].FIELD_VALUE_NM + 1;
        
        const newRVTRANNo = 'RV-' + this.mNewRvNo.toString();
        data.rptVoucher = newRVTRANNo;
        var total = 0;
        var cashamount = 0;
        var chequeamount  = 0;
        var creaditamount = 0;
        var bankcode = 0;
        if (data.rptBank = '') {
          bankcode = 0;
        }
        console.log(data.rptBank);
        for(let i=0; i<data.rptItemArray.length; i++) {
          total += Number(data.rptItemArray[i].rptcreditAmount) 
        }
        if (data.rptPaymentType == "CASH" ){
          for(let i=0; i<data.rptItemArray.length; i++) {
            cashamount += Number(data.rptItemArray[i].rptcreditAmount) 
          }
        }else if(data.rptPaymentType == "CHEQUE"){
          for(let i=0; i<data.rptItemArray.length; i++) {
            chequeamount += Number(data.rptItemArray[i].rptcreditAmount)
          }
          bankcode = data.rptBank;
        }else{
          for(let i=0; i<data.rptItemArray.length; i++) {
            creaditamount += Number(data.rptItemArray[i].rptcreditAmount) 
          }
          bankcode = data.rptBank;
        }
        var rcvDatatemparr: any[] = [];
        for(let i=0; i<data.rptItemArray.length; i++) {
          console.log(data.rptItemArray[i]);
          const opbalval = Number(data.rptItemArray[i].rptcreditAmount);
          const val = {
            accode: data.rptItemArray[i].rptAccontcode,
            amt: opbalval
          }
          if(rcvDatatemparr.length === 0) {
            rcvDatatemparr.push(val);
          } else {
            for(let j=0; j<rcvDatatemparr.length; j++) {
              if(rcvDatatemparr[j].glcode === val.accode) {
                rcvDatatemparr[j].amt += val.amt;
                break;
              } else { 
                rcvDatatemparr.push(val);
                break;
              }
            }
          }
        }

        
        this.financeservice.updateNewDocRvNo(this.mNewRvNo,this.mYear);
      this.crmservice.postRVTranHead(this.mYear, data.rptVoucher, this.formatDate(data.rptVoucherDate),data.rptDebitAccount, data.rptName, total.toString(), data.rptNarration,cashamount.toString(),data.refno,bankcode.toString(),this.formatDate(data.rptRefDate),chequeamount.toString(),data.rptRefNo,creaditamount.toString(), data.rptName, this.formatDate(data.rptRefDate), data.rptName, this.mCurDate);
      this.crmservice.postRVsgldatatemp(this.mYear, data.rptVoucher,this.formatDate(data.rptVoucherDate),data.rptRefNo,this.formatDate(data.rptRefDate),bankcode.toString(),'D',data.rptDebitAccount,0,0,total, data.rptNarration);
        for(let i=0; i<rcvDatatemparr.length; i++) {
          console.log(rcvDatatemparr[i]);
          this.crmservice.postRVsgldatatemp(this.mYear, data.rptVoucher, this.formatDate(data.rptVoucherDate),data.rptRefNo,this.formatDate(data.rptRefDate),bankcode.toString(),'C',rcvDatatemparr[i].accode, rcvDatatemparr[i].amt,total,0,data.rptNarration);
        }
      this.crmservice.postRVOutstanding(this.mYear,data.rptVoucher,this.formatDate(data.rptVoucherDate),data.rptRefNo,this.formatDate(data.rptRefDate),data.rptDebitAccount,total,data.rptNarration);
      
      this.snackBar.open(newRVTRANNo + " successfully added", "close", {
        duration: 10000,
        verticalPosition: 'top',
        panelClass: ['sbBg']
      });
      this.refreshForm();
    }, (err: any) => {
        console.log(err);
      })
    }else{
      this.crmservice.deleteTran(data.rptVoucher,this.mYear).subscribe((res: any) => {
        var total = 0;
        var cashamount = 0;
        var chequeamount  = 0;
        var creaditamount = 0;
        var bankcode = 0;
        console.log(data.rptBank);
        for(let i=0; i<data.rptItemArray.length; i++) {
          total += Number(data.rptItemArray[i].rptcreditAmount) 
        }
        if (data.rptPaymentType == "CASH" ){
          for(let i=0; i<data.rptItemArray.length; i++) {
            cashamount += Number(data.rptItemArray[i].rptcreditAmount) 
          }
        }else if(data.rptPaymentType == "CHEQUE"){
          for(let i=0; i<data.rptItemArray.length; i++) {
            chequeamount += Number(data.rptItemArray[i].rptcreditAmount)
          }
          
          bankcode = data.rptBank;
        }else{
          for(let i=0; i<data.rptItemArray.length; i++) {
            creaditamount += Number(data.rptItemArray[i].rptcreditAmount) 
          }
         
          bankcode = data.rptBank;
        }
        var rcvDatatemparr: any[] = [];
        for(let i=0; i<data.rptItemArray.length; i++) {
          console.log(data.rptItemArray[i]);
          const opbalval = Number(data.rptItemArray[i].rptcreditAmount);
          const val = {
            accode: data.rptItemArray[i].rptAccontcode,
            amt: opbalval
          }
          if(rcvDatatemparr.length === 0) {
            rcvDatatemparr.push(val);
          } else {
            for(let j=0; j<rcvDatatemparr.length; j++) {
              if(rcvDatatemparr[j].glcode === val.accode) {
                rcvDatatemparr[j].amt += val.amt;
                break;
              } else { 
                rcvDatatemparr.push(val);
                break;
              }
            }
          }
        }
        console.log(bankcode.toString());
        console.log(total.toString())
      this.crmservice.postRVTranHead(this.mYear, data.rptVoucher, this.formatDate(data.rptVoucherDate),data.rptDebitAccount, data.rptName, total.toString(), data.rptNarration,cashamount.toString(),data.refno,bankcode.toString(),this.formatDate(data.rptRefDate),chequeamount.toString(),data.rptRefNo,creaditamount.toString(), data.rptName, this.formatDate(data.rptRefDate), data.rptName, this.mCurDate);
      this.crmservice.postRVsgldatatemp(this.mYear, data.rptVoucher,this.formatDate(data.rptVoucherDate),data.rptRefNo,this.formatDate(data.rptRefDate),bankcode.toString(),'D',data.rptDebitAccount,0,0,total, data.rptNarration);
        for(let i=0; i<rcvDatatemparr.length; i++) {
          console.log(rcvDatatemparr[i]);
          this.crmservice.postRVsgldatatemp(this.mYear, data.rptVoucher, this.formatDate(data.rptVoucherDate),data.rptRefNo,this.formatDate(data.rptRefDate),bankcode.toString(),'C',rcvDatatemparr[i].accode, rcvDatatemparr[i].amt,total,0,data.rptNarration);
        }
      this.crmservice.postRVOutstanding(this.mYear,data.rptVoucher,this.formatDate(data.rptVoucherDate),data.rptRefNo,this.formatDate(data.rptRefDate),data.rptDebitAccount,total,data.rptNarration);
      
      this.snackBar.open(data.rptVoucher + " successfully Updated", "close", {
        duration: 10000,
        verticalPosition: 'top',
        panelClass: ['sbBg']
      });
    this.searchVocher(data.rptVoucher);
    }, (err: any) => {
        console.log(err);
      })
    }
  }

   arrowDownEvent(type: string, index: number){
     this.highlight(type, ++index);
   }

   selectSiv(obj: any) {
    this.mVoochNo = obj.TRN_NO;
    console.log(obj.CHEQUE_BANK_NAME);
    this.rptItems.clear();
    if(obj.CASH_AMT> 0){
      this.payeetype = "CASH";
      this.refNo = "";
      this.refdate = this.formatDate(Date.now());
    }else if(obj.CHEQUE_AMT > 0){
      this.payeetype = "CHEQUE";
      this.refNo = obj.CHEQUE_NO;
      this.refdate = obj.CHEQUE_DT;
    }else {
      this.payeetype = "CREDITCARD";
      this.refNo = obj.CREDIT_CARD_NO;
      this.refdate = obj.CREDIT_CARD_EXPIRY
    }
    const date = this.formatDate(obj.TRN_DATE);
    this.ReceiptVoucherForm.patchValue({
      rptVoucher: obj.TRN_NO,
      rptVoucherDate: obj.TRN_DATE,
      rptPaymentType: obj.CURRENCY_CODE,
      rptDebitAccount: obj.CUST_CODE,
      rptAccountDescription: obj.CUST_NAME,
      rptRefNo: this.refNo,
      rptRefDate: obj.CHEQUE_DT,
      rptBank: obj.CHEQUE_BANK,
      rptName: obj.CONTACT_NAME,
      rptNarration: obj.NARRATION,
      rptCurrency: this.payeetype,
      rptExchRate: obj.CURR_RATE, 
    });
    this.crmservice.getInvoiceReceipt(this.mVoochNo, this.mYear).subscribe((res: any) => {
      const itemArr = res.recordset;
      for(let x=0; x<itemArr.length; x++) {
              const rptVoucerGrid = new FormGroup({
                rptAccontcode: new FormControl(itemArr[x].ACCODE, [Validators.required]),
                rptAccountName: new FormControl(itemArr[x].ACCNAME, [Validators.required]),
                rptDescription: new FormControl(itemArr[x].REMARKS, [Validators.required]),
                rptcreditAmount: new FormControl(itemArr[x].GLCR_BAL, [Validators.required]),
                rptAllocation: new FormControl(itemArr[x].ALLOCATED_AMOUNT, [Validators.required]),
              });
              this.rptItems.push(rptVoucerGrid);
            }
        }, (error: any) => {
          console.log(error);
        })
    let dialogRef = this.dailog.closeAll();
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

