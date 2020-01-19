import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {ConfigService} from './config.service';
import { LibraryCredentials } from '../models/library-credentials';
import { CryptoModule } from './key.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private hskaStudentInfoUrl = ConfigService.getApiEndpoint('HSKA_STUDENT_INFO_URL');
  private hskaLibBooksUrl = ConfigService.getApiEndpoint('HSKA_LIB_BORROWED_BOOKS_URL');
  private libCredentials: LibraryCredentials;

  constructor(private http: HttpClient, private cryptoMod: CryptoModule) {
    this.libCredentials = new LibraryCredentials();
  }

  public setCookie(cname: string, cvalue: string, exdays: number) {
      const d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      const expires = 'expires=' + d.toUTCString();
      document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  public getCookie(cname: string): string {
      const name = cname + '=';
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
              return c.substring(name.length, c.length);
          }
      }
      return '';
  }

  public checkCookie(cname: string): boolean {
    return this.getCookie(cname) !== '';
  }

  public getStudentInformation(username: string, password: string) {
    const token = btoa(username + ':' + password);
    this.setCookie('iwibot-creds', token, 365);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + token
      })
    };
    return this.http.get(this.hskaStudentInfoUrl, httpOptions);
  }

  public verifyLibraryCredentials(username: string, password: string) {
    const token = btoa(username + ':' + password);
    //this.setCookie('iwibot-creds', token, 365);
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + token
      })
    };
    return this.http.get(this.hskaLibBooksUrl, httpOptions);
  }

  public setLibCredentials(username: string, passowrd: string) {
    this.libCredentials.name = username;
    this.libCredentials.password = passowrd;
  }

  public libCredentialsAvailable(): boolean {
    if (this.libCredentials.name) {
      return true;
    }
    return false;
  }

  public getEncryptedLibCredentials(): any {
    return this.cryptoMod.createEncryptedJsonMessage(JSON.stringify(this.libCredentials));
  }

}
