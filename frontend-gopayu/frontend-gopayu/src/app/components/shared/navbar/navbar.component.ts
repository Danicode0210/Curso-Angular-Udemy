import { MatDialog, MatSnackBar } from '@angular/material';
import { PromotionalmodalComponent } from './../promotionalmodal/promotionalmodal.component';
import { Component, OnInit } from "@angular/core";

import { Store } from "@ngrx/store";

import { Subscription } from "rxjs";

import { AppState } from "../../../app.state";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styles: [],
})
export class NavbarComponent implements OnInit {
  public i18n;
  public assetsSubscription: Subscription;
  public texts$;
  public pokerActive: boolean = true;
  public virtualesActive: boolean = true;
  public casinoActive: boolean = true;
  public isLiveChat:boolean = true;
  public Callback:boolean = true;
  public isAuth: boolean;
  public Promotions:boolean = true;

  constructor(private store: Store<AppState>,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.assetsSubscription = this.store
      .select("assets")
      .subscribe((assets) => {
        this.texts$ = assets.texts;
        this.i18n = assets.i18n;
        if (this.i18n.Poker) {
          this.pokerActive = this.i18n.Poker.isActived;
        }
        if(this.i18n.Chat && this.i18n.Chat.livechat == 'active')
        {
          this.isLiveChat = true;
        }
        if(this.i18n.Virtuales)
        {
          this.virtualesActive = this.i18n.Virtuales.isActived;
        }

        if(this.i18n.Casino)
        {
          this.casinoActive = this.i18n.Casino.isActived;
        }

        if(this.i18n.Callback)
        {
          this.Callback = true;
        }

        if(this.i18n.Promotions)
        {
          this.Promotions = true;
        }
        
      });

      if (localStorage.getItem("session")) {
        this.isAuth = true;
      }
  }

  openPromotionsModal()
  {
    if (this.isAuth) {
      this.dialog.open(PromotionalmodalComponent, {
        panelClass: "promotions-dialog",
      });
    } else {
      this.snackBar.open("Debes iniciar sesión", "Cerrar", {
        duration: 3000,
      });
    }
    
  }

  toggleChat()
  {     
      if(!this.isLiveChat)
      {
        let accept: any = document.querySelector('.cx-submit .cx-btn .cx-btn-primary .i18n');
        console.log(accept);
        let button:any = document.querySelector('.chattigo-widget-trigger');
        button.click();
      }
      else 
      {
        document.getElementById("chat-button").click();
      }
  }

  getAdvancedConfig() {
    return {
      "form": {
        "autoSubmit": false,
        "firstname": "",
        "lastname": "",
        "email": ""
      },
      "formJSON": {
        "wrapper": "<table></table>",
        "inputs": [
          {
            "id": "cx_webchat_form_firstname",
            "name": "firstname",
            "maxlength": "100",
            "placeholder": "Obligatorio",
            "label": "Nombre",
            validate: function(event, form, input, label, jQuery, CXBus, Common) {
                if (input) {
                    if (input.val() != "") {
                        return true;
                    }
                    else
                        return false;
                }
                return false;
            }
          },
          {
            "id": "cx_webchat_form_lastname",
            "name": "lastname",
            "maxlength": "100",
            "placeholder": "Obligatorio",
            "label": "Apellido",
            validate: function(event, form, input, label, jQuery, CXBus, Common) {
                if (input) {
                    if (input.val() != "")
                        return true;
                    else
                        return false;
                }
                return true;
            }
          },
      {
            "id": "cx_webchat_form_emailaddress",
            "name": "emailaddress",
            "maxlength": "100",
            "placeholder": "Obligatorio",
            "label": "Email",
  //         validate: function(event, form, input, label, jQuery, CXBus, Common) {
  //             if (input) {
  //                 if (input.val() != "")
  //                     return true;
  //                 else
  //                     return false;
  //             }
  //             return true;
  //         }
          }
  //	  ,{
    //        "id": "cx_webchat_form_phonenumber",
    //        "name": "phoneNumber",
    //        "maxlength": "100",
    //        "placeholder": "Obligatorio",
    //        "label": "Teléfono",
    //        validate: function(event, form, input, label, jQuery, CXBus, Common) {
    //            if (input) {
    //                if (input.val() != "")
    //                    return true;
    //                else
    //                    return false;
    //            }
    //            return false;
    //        }
    //      },
  //	   /*No obligatorio*/
    //      {
    //        "id": "cx_webchat_form_customField2",
    //        "name": "customField2",
    //        "maxlength": "100",
    //        "placeholder": "Opcional",
    //        "label": "Razón Social"
    //      },
        ]
      }
    };
  }

  gaEventNavBar(buttonLabel): void {
    if (buttonLabel !== undefined) {
      const event = {
        event: 'ga_event',
        category: 'Header',
        action: 'BPW - Menú principal',
        label: buttonLabel.target.innerText
      };
      window.dataLayer.push(event);
    }
  }
}
