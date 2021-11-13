import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
//import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from './services/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'IFAResort';
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;

  fName: string = "";
  lName: string = "";

  loginBool : boolean = true;
  contentBool: boolean = false;

  signinBool: boolean = true;
  signupBool: boolean = false;
  forgotPasswordBool: boolean = false;

  showCRM: boolean = true;
  showSC: boolean = true;
  showMMP: boolean = true;
  showMIS: boolean = true;
  showPMP: boolean = true;
  showHRMS: boolean = true;
  showWMS: boolean = true;
  showECom: boolean = true;
  showAT: boolean = true;
  showFn: boolean=true;

  notmatched: boolean = false;

  siteLanguage: string = 'English';
  siteLocale!: string;
  languageList = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' }
  ];

  signinForm: FormGroup;
  signupForm: FormGroup;
  recoverPasswordForm: FormGroup;

  loading = false;
  submitted = false;
  error = '';
  usrPwd: string = "";

  constructor(private authenticationService: AuthenticationService) { 
    this.signinForm = new FormGroup({
      username: new FormControl('', [ Validators.required ]),
      password: new FormControl('', [ Validators.required ])
    });

    this.signupForm = new FormGroup({
      username: new FormControl('', [ Validators.required ]),
      password: new FormControl('', [ Validators.required ]),
      confirmPassword: new FormControl('', [ Validators.required ]),
      firstname: new FormControl('', [ Validators.required ]),
      lastname: new FormControl('', [ Validators.required ]),
      contactno: new FormControl('', [ Validators.required ]),
      terms: new FormControl(false)
    });

    this.recoverPasswordForm = new FormGroup({
      username: new FormControl('', [ Validators.required ]),
      password: new FormControl('', [ Validators.required ]),
      confirmPassword: new FormControl('', [ Validators.required ]),
    });
  }

  ngOnInit() {
    this.siteLocale = window.location.pathname.split('/')[1];
  
    this.siteLanguage = this.languageList.find(f => f.code === this.siteLocale)!.label;
  }

  onSignin() {
    const data = this.signinForm.value;
    console.log(data);
    this.submitted = true;
    // stop here if form is invalid
    if (this.signinForm.invalid) {
      return;
    } 
    else {
      this.loading = true;
      this.encrypt(data.password);
    
      this.authenticationService.signin(data.username).subscribe ((res: any) => {
        console.log(res.recordset[0]);
        if(this.usrPwd === res.recordset[0].PASSWORD) {
          this.error = "";
          // if signin success then:
          this.fName = res.recordset[0].FIRSTNAME;
          this.lName = res.recordset[0].LASTNAME;
          this.authenticationService.setUser(res.recordset[0].FIRSTNAME, res.recordset[0].LASTNAME, res.recordset[0].USERCLASS)
          this.loginBool = false;
          this.contentBool = true;
          this.signinForm = new FormGroup({
            username: new FormControl('', [ Validators.required ]),
            password: new FormControl('', [ Validators.required ])
          });
        }
        else {
          this.error = "Password is incorrect!";
        }
      },
      (err: any) => {
        this.error = "Username or Password is incorrect!";
      });
    }
  }

  onSignup() {
    const data = this.signupForm.value;
    console.log(this.signupForm);
    this.submitted = true;
    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    } else {
      this.loading = true;
      this.encrypt(data.password);
  
      console.log(data);
      console.log(this.usrPwd);
  
      this.authenticationService.signup(data.firstname, data.lastname, data.username, this.usrPwd, data.contactno);
      /*this.snackBar.open(data.username + " successfully added", "close", {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: ['sbBg']
      });*/
      this.showSignIn();
  
      this.signupForm = new FormGroup({
        username: new FormControl('', [ Validators.required ]),
        password: new FormControl('', [ Validators.required ]),
        confirmPassword: new FormControl('', [ Validators.required ]),
        firstname: new FormControl('', [ Validators.required ]),
        lastname: new FormControl('', [ Validators.required ]),
        contactno: new FormControl('', [ Validators.required ]),
        terms: new FormControl(false)
      });
    }
  }

  onSignOut() {
    this.fName = "";
    this.lName = "";
    this.loginBool = true;
    this.contentBool = false;
  }
  
  onRecoverPassword(){
    this.recoverPasswordForm = new FormGroup({
      username: new FormControl('', [ Validators.required ]),
      password: new FormControl('', [ Validators.required ]),
      confirmPassword: new FormControl('', [ Validators.required ]),
    });
  }

  checkPassword() {

  }

  showSignIn() {    
    this.signinBool = true;
    this.signupBool = false;
    this.forgotPasswordBool = false;
  }

  showSignUp() {
    this.signinBool = false;
    this.signupBool = true;
    this.forgotPasswordBool = false;
  }

  showForgotPass() {
    this.signinBool = false;
    this.signupBool = false;
    this.forgotPasswordBool = true;
  }

  encrypt(pwd: string) {
    this.usrPwd = "";
    var i: number;
    var ascii: number;
    for(i = 0; i < pwd.length; i++) {
      ascii = pwd[i].charCodeAt(0)+10;
      this.usrPwd += String.fromCharCode(ascii);
    }
  }

  get f() { return this.signinForm.controls; }  

  get g() { return this.signupForm.controls; }

  get h() { return this.recoverPasswordForm.controls; }

}
