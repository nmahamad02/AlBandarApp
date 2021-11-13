import { Component, OnInit } from '@angular/core';
import { CrmService } from 'src/app/services/crm/crm.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  memberData: any[] =[];

  priMemBool: boolean = true;
  actMemBool: boolean = false;
  expAgrBool: boolean = false;
  memBirthBool: boolean = false;
  corMemBool: boolean = false;
  famMemBool: boolean = false;
  comMemBool: boolean = false;

  constructor(private crmservice: CrmService) {
    this.getMemberData('pri');
  }

  ngOnInit(): void {
  }

  getMemberData(value: any) {
    if (value === "pri") {
      this.crmservice.getExprtPrimaryMembers().subscribe((res: any) => {
        this.memberData = res.recordset;
      }, (err: any) => {
        console.log(err);
      })
    } else if (value === "act") {

    } else if (value === "agr") {
      
    } else if (value === "bir") {
      
    } else if (value === "cor") {
      
    } else if (value === "fam") {
      
    } else if (value === "com") {
      
    } else {
      console.log("Error")
    }
  }

  showPrimaryMembers() {
    this.priMemBool = true;
    this.actMemBool = false;
    this.expAgrBool = false;
    this.memBirthBool = false;
    this.corMemBool = false;
    this.famMemBool = false;
    this.comMemBool = false;
  }

  showActiveMembers() {
    this.priMemBool = false;
    this.actMemBool = true;
    this.expAgrBool = false;
    this.memBirthBool = false;
    this.corMemBool = false;
    this.famMemBool = false;
    this.comMemBool = false;
  }

  showExpiringAgreements() {
    this.priMemBool = false;
    this.actMemBool = false;
    this.expAgrBool = true;
    this.memBirthBool = false;
    this.corMemBool = false;
    this.famMemBool = false;
    this.comMemBool = false;
  }

  showMemberBirthdays() {
    this.priMemBool = false;
    this.actMemBool = false;
    this.expAgrBool = false;
    this.memBirthBool = true;
    this.corMemBool = false;
    this.famMemBool = false;
    this.comMemBool = false;
  }

  showCorporateMembers() {
    this.priMemBool = false;
    this.actMemBool = false;
    this.expAgrBool = false;
    this.memBirthBool = false;
    this.corMemBool = true;
    this.famMemBool = false;
    this.comMemBool = false;
  }

  showFamilyMembers() {
    this.priMemBool = false;
    this.actMemBool = false;
    this.expAgrBool = false;
    this.memBirthBool = false;
    this.corMemBool = false;
    this.famMemBool = true;
    this.comMemBool = false;
  }

  showComplimentaryMembers() {
    this.priMemBool = false;
    this.actMemBool = false;
    this.expAgrBool = false;
    this.memBirthBool = false;
    this.corMemBool = false;
    this.famMemBool = false;
    this.comMemBool = true;
  }
}
