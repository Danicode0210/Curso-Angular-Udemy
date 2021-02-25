import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private account;
  private apiKey;
  private token;
  public assetsSubscription: Subscription;
  public verificationCode;
  public encriptionKey = '83TPL4Y@CEM';
  public error = false;
  constructor(
    private http: HttpClient,
    private store: Store<AppState>
    ) {
  }

  generateMessageHablame(phoneNumber, isRegister) {
      const url = `${environment.messagingApiURLHablame}` + 'generate_message';
      return this.http.post(url, {phoneNumber: phoneNumber, isRegister: isRegister}).pipe((res) => {
        return res;
      });
  }

  generateMessageBlipBlip(phoneNumber, isRegister) {
    const url = `${environment.messagingApiURLBlipBlip}` + 'generate_message';
    return this.http.post(url, {phoneNumber: phoneNumber, isRegister: isRegister}).pipe((res) => {
      return res;
    });
  }

  encryptCode(code) {
    const encrypt = CryptoJS.AES.encrypt(code.toString(), this.encriptionKey.toString());
    sessionStorage.setItem('code', encrypt);
  }

  validateMessage(code) {
    const content = sessionStorage.getItem('code');
    const encrypt = CryptoJS.AES.decrypt(content.toString(), this.encriptionKey.toString()).toString(CryptoJS.enc.Utf8);
    if (code === encrypt.toString()) {
      this.verificationCode = '';
      sessionStorage.removeItem('code');
      return true;
    } else {
      return false;
    }
  }
}
