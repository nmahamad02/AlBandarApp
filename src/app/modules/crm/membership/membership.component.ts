import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit {
  agreementForm: FormGroup;
  memberList: any[];
  servicesList: any[];

  constructor() { 
    this.agreementForm = new FormGroup({ 
      agrNo: new FormControl('', [Validators.required]),
      agrDate: new FormControl('', [Validators.required]),
      billingCode: new FormControl('', [Validators.required]),
      add1: new FormControl('', []),
      add2: new FormControl('', []),
      add3: new FormControl('', []), 
      phone: new FormControl('', []),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      fob: new FormControl('', [Validators.required]),
      services: new FormArray([]),
      members: new FormArray([]),
      total: new FormControl('', [Validators.required])
    });
  }

  getData() {

  }

  ngOnInit(): void {
  }

  newForm() {

  }
   
  submitForm() {

  }

  exportAsXLSX(){

  }

}
