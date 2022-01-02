import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { SortController } from 'ag-grid-community';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private url = 'http://15.185.46.105:5000/api';
 
  constructor(private http: HttpClient) { }
  
  getTrailBalance(year: string) { 
    return this.http.get(this.url + '/reports/financials/trialbalance/' + year)
  }

  getCustomerForExcel() { 
    return this.http.get(this.url + '/coa/getCustomerForExcel')
  }

  getPartyForExcel() { 
    return this.http.get(this.url + '/coa/getPartyForExcel')
  }
  
  getCoa(year: string) {
    return this.http.get(this.url + '/coa/getcoa/' + year)
  }

  getMainGrp(year: string) {
    return this.http.get(this.url + '/coa/getmaingrp/' + year)
  }

  deleteDepartmentExpense(deptid: string) {
    return this.http.get(this.url + '/coa/deleteDepartmentExpense/' + deptid)
  }
  
  getSubGrp(maingrpcode:string, year: string) {
    return this.http.get(this.url + '/coa/getsubgrp/' + maingrpcode + '/' + year)
  }

  getGL(subgroupcode: string, year: string) {
    return this.http.get(this.url + '/coa/getgl/' + subgroupcode + '/' + year)
  }

  getPcode(glcode: string, year: string) {
    return this.http.get(this.url + '/coa/getpcode/' + glcode + '/' + year)
  }

  getAccountCode(pcode: string, fyear: string) { 
    return this.http.get(this.url + '/coa/getAcc/' + pcode + '/' + fyear)
  }

  getAllDepartmentExpensesforDP(fyear: string) { 
    return this.http.get(this.url + '/coa/getAllDepartmentExpensesforDP/' + fyear)
  }

  getCustomerList(fyear: string) { 
    return this.http.get(this.url + '/coa/getCustomerAcc/' + fyear)
  }

  getDepartmentMaster(prefix: string) { 
    return this.http.get(this.url + '/coa/getDepartmentMaster/' + prefix)
  }

  getCustomerBypcode(pcode: string) { 
    return this.http.get(this.url + '/coa/getDebitAccountBypocde/' + pcode)
  }

  getDepartmentforGrid(fyear:string, compocde:string, deptid: string) { 
    return this.http.get(this.url + '/coa/getDepartmentsGrid/' + fyear + '/' + compocde + '/' + deptid)
  }

  searchDepartmentMaster(prefix: string) { 
    return this.http.get(this.url + '/coa/searchDepartmentMaster/' + prefix )
  }

  getAreaName(name: string) { 
    return this.http.get(this.url + '/coa/getAreaName/' + name )
  }

  getPartyByName(areaname: string) { 
    return this.http.get(this.url + '/coa/getPartyByName/' + areaname )
  }

  getDepartmentMasterExpid() { 
    return this.http.get(this.url + '/coa/getDepartmentMasterExpid' )
  }

  getSupplierList(fyear: string) { 
    return this.http.get(this.url + '/coa/getSupplierAcc/' + fyear)
  }

  getnotofDepartmentMaster(prefix: string) {
    return this.http.get(this.url + '/coa/getnotofDepartmentMaster/' + prefix)
  } 
  
  getCustomerParty(pcode:string){
    return this.http.get(this.url + '/coa/getPartyCustomer/' + pcode)
  }
  getAllParty() {
    return this.http.get(this.url + '/ar/getAllParty')
  }

  getCustomerInvoices(pcode:string, sfyear:string, efyear:string){
    return this.http.get(this.url + '/coa/getCustomerOpening/' + pcode +'/' + sfyear + '/' + efyear)
  }

  getAccountsCategory() {
    return this.http.get(this.url + '/coa/getAccountsCategory')
  }

  getAccountsType() {
    return this.http.get(this.url + '/coa/getAccountsType')
  }

  getProducts(year:string ) {
    return this.http.get(this.url + '/productList/' + year )
  }

  getBranch() {
    return this.http.get(this.url + '/coa/getBranch')
  }

  getLastSiv(year: string) {
    return this.http.get(this.url + '/coa/getsivnodoc/' + year )
  }

  getCustomerMemner(pcode:string) {
    return this.http.get(this.url + '/coa/getCustomerMember/'+ pcode)
  }

  getAgreementDetails() {
    return this.http.get(this.url + '/coa/getAgreement')
  }

  getMaxTax() {
    return this.http.get(this.url + '/coa/getMaxTax')
  }

  getServiceDetails(serviceid:string) {
    return this.http.get(this.url + '/coa/getServicesDetails/'+ serviceid)
  }

  getDocForArg(year: string) {
    return this.http.get(this.url + '/coa/getDocForArg/' + year)
  }

  searchServicesDetails(serviceid:string) {
    return this.http.get(this.url + '/coa/searchServicesDetails/'+ serviceid)
  }

 getAllService() {
    return this.http.get(this.url + '/coa/getAllService')
  }

  getMaxOfRef() {
    return this.http.get(this.url + '/coa/getMaxRefID')
  } 

  getAllTaxCategory() {
    return this.http.get(this.url + '/coa/getTaxCategory')
  }

  getAllTaxCategoryData() {
    return this.http.get(this.url + '/coa/getTaxcategoryData')
  }

  getAggrementDetails(pcode:string) {
    return this.http.get(this.url + '/coa/getAggrementDetails/'+ pcode)
  }

  getTaxCategorybytaxcode(taxcode:string) {
    return this.http.get(this.url + '/coa/getTaxCategorybytaxcode/'+ taxcode)
  }

  
  setNewSiv(newSivVal: string, year: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newSiv = {
      newVal: newSivVal,
      year: year
    }

    this.http.post(this.url + '/coa/updateSivDocNo', JSON.stringify(newSiv), { headers: headers }).subscribe((res: any) => {
      console.log(res);
    })
  }

  updateNewDocRvNo(newVal: string, year: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      newVal: newVal,
      year: year, 
    }

    this.http.post(this.url + '/coa/updateNewRVDocNO', JSON.stringify(newTran), { headers: headers }).subscribe((res: any) => {
      console.log(res);
    })
  }

  postAddeptarmentmaster(compcode: string, deptid: string, prefix: string, deptname: string, lastno: string, active: string, expensetype: string, user: string, date: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      compcode: compcode,
      deptid: deptid, 
      prefix: prefix,
      deptname:deptname,
      lastno: lastno,
      active: active,
      expensetype: expensetype,
      user: user,
      date: date
    }

    this.http.post(this.url + '/coa/postAddeptarmentmaster', JSON.stringify(newTran), { headers: headers }).subscribe((res: any) => {
      console.log(res);
    })
  }

  postAggrementBLA(pcode: string, agreementno: string, serviceno: string, memberprice: string, compcode: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      pcode: pcode,
      agreementno:agreementno,
      serviceno: serviceno,
      memberprice: memberprice,
      compcode: compcode
    }

    return this.http.post(this.url + '/coa/postAgrement', JSON.stringify(newTran), { headers: headers })
  }

  postAgreementMaster(compcode: string, qutono: string, agrno: string, agrdate: string, sono:string, partyid: string, pcode: string, custname: string, custadd1: string, custadd2: string, custphone: string,remarks: string, createdate: string, createuser: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      compcode : compcode,
      qutono : qutono,
      agrno : agrno,
      agrdate : agrdate,
      sono: sono,
      partyid : partyid,
      pcode : pcode,
      custname : custname,
      custadd1 : custadd1,
      custadd2 : custadd2,
      custphone : custphone,
      remarks : remarks,
      createdate : createdate,
      createuser : createuser
    }

    this.http.post(this.url + '/coa/postagrementmaster', JSON.stringify(newTran), { headers: headers }).subscribe((res: any) => {
      console.log(res);
    })
  }

  updateAgreementMaster(qutono: string, argdate: string, partyid:string, pcode: string, custname: string, add1: string, add2: string, phone: string, remarks: string,editdt: string, edituser: string, agrno: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      qutono : qutono,
      argdate : argdate,
      partyid: partyid,
      pcode : pcode,
      custname : custname,
      add1 : add1,
      add2 : add2,
      phone : phone,
      remarks : remarks,
      editdt : editdt,
      edituser : edituser,
      agrno : agrno
    }

    this.http.post(this.url + '/coa/updateagrementmaster', JSON.stringify(newTran), { headers: headers }).subscribe((res: any) => {
      console.log(res);
    })
  }

  updateAgreementDetails(itcode: string, desc: string, membercode: string, membername: string, frmdate:string, todate: string, value: string, price: string, disper: string, disamt: string, vatcategory: string,vat: string, amount: string, editdt: string,edituser: string, agrno: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      itcode : itcode,
      desc : desc,
      membercode : membercode,
      membername : membername,
      frmdate: frmdate,
      todate : todate,
      value : value,
      price : price,
      disper : disper,
      disamt : disamt,
      vatcategory : vatcategory,
      vat : vat,
      amount : amount,
      editdt : editdt,
      edituser : edituser,
      agrno : agrno
    }

    this.http.post(this.url + '/coa/updateagrementdetails', JSON.stringify(newTran), { headers: headers }).subscribe((res: any) => {
      console.log(res);
    })
  }

  updatedocAgreement(fieldvalue: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      fieldvalue : fieldvalue
    }

    this.http.post(this.url + '/coa/updatedocagrement', JSON.stringify(newTran), { headers: headers }).subscribe((res: any) => {
      console.log(res);
    })
  }

  postAgreementDetails(argno: string, compcode: string, itcode: string, desc: string, membercode: string, memmbername: string, fromdate: string, todate: string, value: string, price: string,disper: string, disamt: string, vatcategory: string,vat: string,amount: string, createdate: string, createuser: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      argno : argno,
      compcode : compcode,
      itcode : itcode,
      desc : desc,
      membercode : membercode,
      memmbername : memmbername,
      fromdate : fromdate,
      todate : todate,
      value : value,
      price : price,
      disper : disper,
      disamt : disamt,
      vatcategory : vatcategory,
      vat : vat,
      amount : amount,
      createdate : createdate,
      createuser : createuser,
    }

    this.http.post(this.url + '/coa/postagrementdetails', JSON.stringify(newTran), { headers: headers }).subscribe((res: any) => {
      console.log(res);
    })
  }

  postOpbalDetails(compcode: string, pcode: string, custname: string, accountcategory: string, acounttype: string,cprno: string, tax1no: string,status: string,fyear: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      compcode : compcode,
      pcode : pcode,
      custname : custname,
      accountcategory : accountcategory,
      acounttype : acounttype,
      cprno : cprno,
      tax1no : tax1no,
      status : status,
      fyear: fyear
    }

    this.http.post(this.url + '/coa/postOPBAL', JSON.stringify(newTran), { headers: headers }).subscribe((res: any) => {
      console.log(res);
    })
  }

  updateOPbalDeatils(custname: string, accountcategory: string,status: string,accountype: string,cpr: string, tax1no: string,pcode: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      pcode : pcode,
      custname : custname,
      accountcategory : accountcategory,
      status : status,
      accountype : accountype,
      cpr : cpr,
      tax1no : tax1no
    }

    this.http.post(this.url + '/coa/updateOPBAL', JSON.stringify(newTran), { headers: headers }).subscribe((res: any) => {
      console.log(res);
    })
  }


  posttax(compcode: string,taxid: string,taxcategorycd: string, taxcategoryname: string, desc: string, taxgroup: string,tax1prec: string, taxglac: string,sequance: string, active: string, createuser: string, creatdt: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      compcode : compcode,
      taxid : taxid,
      taxcategorycd : taxcategorycd,
      taxcategoryname : taxcategoryname,
      desc : desc,
      taxgroup : taxgroup,
      tax1prec : tax1prec,
      taxglac : taxglac,
      sequance : sequance,
      active : active,
      createuser : createuser,
      creatdt : creatdt
    }

    this.http.post(this.url + '/coa/postTaxCategory', JSON.stringify(newTran), { headers: headers }).subscribe((res: any) => {
      console.log(res);
    })
  }

  updatetax(taxname: string, desc: string, taxgroup: string, tax1prc: string, invtax: string,seq: string, active: string, edituser: string, editdt: string,taxid: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      taxname : taxname,
      desc : desc,
      taxgroup : taxgroup,
      tax1prc : tax1prc,
      invtax : invtax,
      seq : seq,
      active : active,
      edituser : edituser,
      editdt : editdt,
      taxid: taxid
    }

    this.http.post(this.url + '/coa/updateTaxCategory', JSON.stringify(newTran), { headers: headers }).subscribe((res: any) => {
      console.log(res);
    })
  }

  postDeptExpenseMaster(compcode: string, deptid: string, expid: string, glcode: string, user: string, date: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      compcode: compcode,
      deptid: deptid, 
      expid: expid,
      glcode:glcode,
      user: user,
      date: date
    }

    this.http.post(this.url + '/coa/postDeptExpenseMaster', JSON.stringify(newTran), { headers: headers }).subscribe((res: any) => {
      console.log(res);
    })
  }

  postReferenceData(recid: string, pcode: string, refname: string, refdesc: string, reftype: string, compcode: string,active: string, createuser: string, createdate: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      recid: recid,
      pcode: pcode, 
      refname: refname,
      refdesc:refdesc,
      reftype: reftype,
      compcode: compcode,
      active:active,
      createuser: createuser,
      createdate: createdate
    }

    this.http.post(this.url + '/coa/postRefData', JSON.stringify(newTran), { headers: headers }).subscribe((res: any) => {
      console.log(res);
    })
  }

  updateReferenceData(name: string, desc: string, type: string, compcode: string, active: string, createuser: string,createdate: string, pcode: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      name: name,
      desc: desc, 
      type: type,
      compcode:compcode,
      active: active,
      createuser: createuser,
      createdate:createdate,
      pcode: pcode
    }

    this.http.post(this.url + '/coa/updateRefData', JSON.stringify(newTran), { headers: headers }).subscribe((res: any) => {
      console.log(res);
    })
  }

  UpdateAddeptarmentmaster(deptname: string, lastno: string, active: string, type: string, edituser: string, date: string,prefix: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      deptname: deptname,
      lastno: lastno, 
      active: active,
      type:type,
      edituser: edituser,
      date: date,
      prefix:prefix
    }

    this.http.post(this.url + '/coa/UpdateAddeptarmentmaster', JSON.stringify(newTran), { headers: headers }).subscribe((res: any) => {
      console.log(res);
    })
  }

  UpdateAddeptarmentExpenseMaster(expid: string, glcode: string, edituser: string, date: string,deptid: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const newTran = {
      expid: expid,
      glcode: glcode, 
      edituser: edituser,
      date:date,
      deptid: deptid
    }
    this.http.post(this.url + '/coa/UpdateAddeptarmentExpenseMaster', JSON.stringify(newTran), { headers: headers }).subscribe((res: any) => {
      console.log(res);
    })
  }

}
