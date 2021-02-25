import { AppState } from './../../../../../app.state';
import { MenuService } from 'src/app/services/menu.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: []
})
export class DocumentsComponent implements OnInit {

  public documents:any = new Array();
  public isLoading:boolean = true;
  public date = new FormControl();
  public image:any;
  public formError:string = '';
  public formSuccess:string = '';
  public texts$;
  public localTexts$;
  public assetsSubscription: Subscription;
  public textBotonCancelar = 'Cancelar';
  public textBotonGuardar = 'Guardar';
  
  @Output()
  private changePage = new EventEmitter();

  constructor(private service:MenuService, private store:Store<AppState>) { }

  ngOnInit() {
    this.assetsSubscription = this.store.select('assets').subscribe( assets => {
      this.texts$ = assets.texts;
      this.localTexts$ = assets.i18n;
    });

      this.getDocuments();
  }

  goBack()
  {
      this.gaEventSendDocuments(this.textBotonCancelar);
      this.changePage.emit();
  }

  uploadDocument(file:File)
  {
      this.gaEventSendDocuments(this.textBotonGuardar);
      this.formError = '';
      if(file && this.image)
      {
        var date = (this.date.value) ? this.date.value.toISOString() : this.date.value;
        var fileName = file.name;
        this.isLoading = true;

        this.service.uploadDocument( this.image.replace('data:image/jpeg;base64,',''), fileName ,date)
        .subscribe((response) => {
          this.isLoading = false;
          this.formSuccess = 'CreatedSuccessfully';
          this.getDocuments();
        },
        () => {
          this.isLoading = false;
          this.formError = 'RequestError';
        });
      }
      else
      {
          this.formError = 'EmptyDocumentSelection';
      }
  }

  imageChange($event)
  {
    var reader  = new FileReader();
    var file = $event.target.files[0];

    if(file)
    {
        reader.onloadend = () => {
          this.image = reader.result;
        }

        reader.readAsDataURL(file);
    }
    else
    {
        this.image = null;
    }

  }

  getDocuments()
  {
      this.service.getDocuments()
      .subscribe((response:any) => {
          this.documents = response;
          this.isLoading = false;
      },
      () => {
          this.isLoading = false;
      });
  }

  gaEventSendDocuments(labels: string): void {
    const event = {
      event: 'ga_event',
      category: 'Mi Cuenta',
      action: 'BPW - Enviar documentos',
      label: labels
    };
    window.dataLayer.push(event);
  }

}
