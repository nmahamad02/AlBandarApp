import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private url = 'http://15.185.46.105:5001/api';
 
  constructor(private http: HttpClient) { }
  
  getTrailBalance(year: string) { 
    return this.http.get(this.url + '/reports/financials/trialbalance/' + year)
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

  getDepartmentforGrid(fyear:string, compocde:string, deptid: string) { 
    return this.http.get(this.url + '/coa/getDepartmentsGrid/' + fyear + '/' + compocde + '/' + deptid)
  }

  searchDepartmentMaster(prefix: string) { 
    return this.http.get(this.url + '/coa/searchDepartmentMaster/' + prefix )
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

  getLastSiv(year: string) {
    return this.http.get(this.url + '/coa/getsivnodoc/' + year )
  }

  getCustomerMemner(pcode:string) {
    return this.http.get(this.url + '/coa/getCustomerMember/'+ pcode)
  }

  getAgreementDetails() {
    return this.http.get(this.url + '/coa/getAgreement')
  }

  getServiceDetails(serviceid:string) {
    return this.http.get(this.url + '/coa/getServicesDetails/'+ serviceid)
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
