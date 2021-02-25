import { AssetsService } from 'src/app/services/assets.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-sn',
  templateUrl: './contact-sn.component.html',
  styleUrls: []
})
export class ContactSnComponent implements OnInit {

  public form:FormGroup;
  public error:string = '';
  public isLoading:boolean = false;
  public success:boolean = false;
  public isHidden:boolean = true;
  
  constructor(private service:AssetsService) { 
    this.form = new FormGroup({
      'name': new FormControl('',[Validators.required, Validators.pattern(/^[a-zA-ZñÑ\s]*$/)]),
      'document': new FormControl('',[Validators.required, Validators.minLength(5), Validators.maxLength(12), Validators.pattern(/^[0-9\s]*$/)]),
      'email': new FormControl('',[Validators.required]),
      'phoneNumber': new FormControl('',[Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^3[0-9\s]*$/)]),
      'message': new FormControl('',[Validators.required]),
      'terms': new FormControl('',[Validators.required]),
    });
  }

  ngOnInit() {
  }

  gaEventFooterContact(linkText: string): void {
    const event = {
      event: 'ga_event',
      category: 'Footer',
      action: 'BPW - Contacto',
      label: linkText
    };
    window.dataLayer.push(event);
  }

  gaEventFooterSocialMedia(socialMedia: string): void {
    const event = {
      event: 'ga_event',
      category: 'Footer',
      action: 'BPW - Redes sociales',
      label: socialMedia
    };
    window.dataLayer.push(event);
  }

  resetForm(){
    this.form.reset();
    this.form = new FormGroup({
      'name': new FormControl('',[Validators.required, Validators.pattern(/^[a-zA-ZñÑ\s]*$/)]),
      'document': new FormControl('',[Validators.required, Validators.minLength(5), Validators.maxLength(12), Validators.pattern(/^[0-9\s]*$/)]),
      'email': new FormControl('',[Validators.required, Validators.email]),
      'phoneNumber': new FormControl('',[Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^3[0-9\s]*$/)]),
      'message': new FormControl('',[Validators.required]),
      'terms': new FormControl('',[Validators.required]),
    });
  }

  launchWriteUsBox(file,termsInput) {
    this.success = false
    this.resetForm()
    termsInput.checked = false
    file.value = ''
    this.isHidden = false
  }

  setTerms(terms){
    if(terms.checked){
      this.form.patchValue({
        terms: "true"
      })
    } else {
      this.form.patchValue({
        terms: ""
      })
    }
  }

  sendWriteUs(file, file2, file3, termsInput) {
    this.markFormGroupTouched(this.form)
    this.error = '';

    if(file.files[0] && (file.files[0].type != 'image/jpeg' && file.files[0].type != 'video/mp4' && file.files[0].type != 'image/png' && !/.docx/.test(file.files[0].name) && !/.pdf/.test(file.files[0].name))){
      this.error = 'El formato del archivo es incorrecto'
    } 
    else if(file.files[0] && file.files[0].size/1000000 >= 20) {
      this.error = 'El archivo no debe superar los 20MB';
    }
    if(file2.files[0] && (file2.files[0].type != 'image/jpeg' && file2.files[0].type != 'video/mp4' && file2.files[0].type != 'image/png' && !/.docx/.test(file2.files[0].name) && !/.pdf/.test(file2.files[0].name))){
      this.error = 'El formato del archivo es incorrecto'
    } 
    else if(file2.files[0] && file2.files[0].size/1000000 >= 20) {
      this.error = 'El archivo no debe superar los 20MB';
    }
    if(file3.files[0] && (file3.files[0].type != 'image/jpeg' && file3.files[0].type != 'video/mp4' && file3.files[0].type != 'image/png' && !/.docx/.test(file3.files[0].name) && !/.pdf/.test(file3.files[0].name))){
      this.error = 'El formato del archivo es incorrecto'
    } 
    else if(file3.files[0] && file3.files[0].size/1000000 >= 20) {
      this.error = 'El archivo no debe superar los 20MB';
    }
    else if(this.form.status == 'VALID' && !this.isLoading){

      if(!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(this.form.value.email))) {
        this.error = 'Ingresa un correo válido'
        return
      }

      this.isLoading = true
      var form = new FormData();

      for(let index in this.form.value){
        form.append(index, this.form.value[index]);
      }

      
      if(file.files[0]){
        form.append('file', file.files[0]);
      }
      if(file2.files[0]){
        form.append('file2', file2.files[0]);
      }

      if(file3.files[0]){
        form.append('file3', file3.files[0]);
      }
      this.service.sendWriteUs(form)
      .subscribe(response => {
        this.isLoading = false
        this.success = true
        termsInput.checked = false
        file.value = ''
        file2.value = ''
        file3.value = ''
        this.resetForm()
      }, (err) => {
        this.isLoading = false
        this.error = "Hubo un error, por favor intenta en unos minutos"
      });
    }
  }

  formatFields(){
    this.form.patchValue({
      'email': this.form.value['email'].toLowerCase(),
      'name': this.form.value['name'].toUpperCase(),
    })
  }

  hasError(field, error){
    if(this.form.controls[field].touched){
      if(error != ''){
        return (this.form.controls[field].hasError(error))
      } else {
        return (this.form.controls[field].invalid)
      }
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
