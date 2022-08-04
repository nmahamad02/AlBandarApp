import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, } from 'rxjs';
//import { LoggedUserModel } from './logged-user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private url = 'http://15.185.46.105:5000/api/user';

  //loggedUserSubject: BehaviorSubject<LoggedUserModel>;
  //loggedUser: LoggedUserModel;

  constructor(private http: HttpClient) {
    //this.loggedUserSubject = new BehaviorSubject(this.loggedUser);
  }

  /*isAuthenticated() {
    return this.loggedUserSubject.asObservable();
  }*/

  setUser(firstname: string, lastname: string, userclass: string) {
    localStorage.setItem('firstname', JSON.stringify(firstname));
    localStorage.setItem('lastname', JSON.stringify(lastname));
    localStorage.setItem('userclass', JSON.stringify(userclass));
  }

  signin(username: string): Observable<any> {
    // your log in logic should go here
    return this.http.get(this.url + '/' + username);
  }

  getUserRole(userclass: string) {
    return this.http.get(this.url + '/roles/' + userclass);
  }

  logout() {
    localStorage.setItem('firstname', "");
    localStorage.setItem('lastname', "");
    localStorage.setItem('userclass', "");
  }

  recoverPassword(usrCode: string, pwd: String) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    const newUsr = {
      usercode: usrCode,
      password: pwd
    }

    return this.http.post(this.url + '/changePassword', JSON.stringify(newUsr), { headers: headers })
  }

  signup(fName: string, lName: string, usrCode: string, pwd: string, cntctNbr: string, userid: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    

    const newUsr = {
      usercode: usrCode,
      password: pwd,
      firstname: fName,
      lastname: lName,
      contactno: cntctNbr,
      userid: userid
    }

    this.http.post(this.url + 's/new', JSON.stringify(newUsr), { headers: headers }).subscribe(response => {
      console.log(response);
    })
  }
  
}
