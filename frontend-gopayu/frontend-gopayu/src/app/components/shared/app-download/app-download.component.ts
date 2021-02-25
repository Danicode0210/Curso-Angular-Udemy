import { AssetsService } from './../../../services/assets.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-download',
  templateUrl: './app-download.component.html',
  styleUrls: ['./app-download.component.styl']
})
export class AppDownloadComponent implements OnInit {

  constructor(private service:AssetsService) { }

  ngOnInit() {
  }

  downloadAPK()
  {
    this.service.getActiveAPK()
    .subscribe(response => {
      if(response['data'].length > 0)
      {
        let apk = response['data'][0];
        window.location.href = response['url']+apk.path;
        window['$']('#modal-download').modal('show');
        window['$']('#donwload-modal').addClass('d-none');
      }
    })
  }

  closeModalDownloadApp(){
    window['$']('#donwload-modal').addClass('d-none');
  }

}
