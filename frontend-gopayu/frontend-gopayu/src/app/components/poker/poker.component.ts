import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { MenuService } from "../../services/menu.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-poker",
  templateUrl: "./poker.component.html",
  styleUrls: ["./poker.component.styl"],
})
export class PokerComponent implements OnInit {
  public page: number = 1;
  public formData: FormGroup;
  public isLoading: boolean = false;
  public successSend: string = "";
  public errorSend: string = "";
  public successBring: string = "";
  public errorBring: string = "";
  public pokerURL = environment.pokerURL;
  public showRegistrationMessage = true;
  public isSubmitedSend: boolean = false;
  public isSubmited: boolean = false;

  @Input()
  balanceBet = "0";
  @Input()
  balancePoker = "0";
  @Output()
  updateBalance = new EventEmitter();

  constructor(private service: MenuService) {
    let profile = JSON.parse(localStorage.getItem("profile"));

    this.formData = new FormGroup({
      amount: new FormControl("", [Validators.required]),
      currency: new FormControl("COP", [Validators.required]),
      userId: new FormControl(profile.accountCode, [Validators.required]),
    });

    // this.validateUser();
  }

  ngOnInit() {}

  validateUser() {
    this.isLoading = true;

    this.service.validateUserPoker(this.formData.value).subscribe(
      (response) => {
        this.isLoading = false;
        if (response["username"] == "") {
          this.showRegistrationMessage = true;
        }
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  requestMoney() {
    this.isSubmited = true;

    let balance = JSON.parse(localStorage.getItem("balance"));

    this.errorBring = "";
    this.successBring = "";
    this.successSend = "";

    if (this.formData.value.amount.replace(/\./g, "") < 1000) {
      this.errorBring = "El valor mínimo es de $1.000";
    } else if (this.formData.value.amount.replace(/\./g, "") > 1000000) {
      this.errorBring = "El valor máximo es de $1.000.000";
    } else if (this.formData.status == "VALID") {
      this.isLoading = true;

      this.service
        .getMoneyPoker({
          amount: this.formData.value.amount.replace(/\./g, ""),
          currency: this.formData.value.currency,
          userId: this.formData.value.userId,
        })
        .subscribe(
          (response) => {
            this.isLoading = false;
            this.isSubmited = false;
            this.updateBalance.emit();

            let profile = JSON.parse(localStorage.getItem("profile"));

            this.formData = new FormGroup({
              amount: new FormControl("", [Validators.required]),
              currency: new FormControl("COP", [Validators.required]),
              userId: new FormControl(profile.accountCode, [
                Validators.required,
              ]),
            });
            this.successBring =
              "Se ha retornado el dinero a tu cuenta de BetPlay correctamente";
          },
          () => {
            this.errorBring =
              "Hubo un error al intentar realizar el envío, valida tu saldo e intenta de nuevo.";
            this.isLoading = false;
          }
        );
    }
  }

  numberFormatUI(field) {
    var num = field.toString().replace(/\./g, "");

    if (!isNaN(num)) {
      num = num
        .toString()
        .split("")
        .reverse()
        .join("")
        .replace(/(?=\d*\.?)(\d{3})/g, "$1.");
      num = num.split("").reverse().join("").replace(/^[\.]/, "");
      return num;
    } else {
      return field.toString().replace(/[^\d\.]*/g, "");
    }
  }
  sendMoney() {
    this.gaEventPokerRecharge();
    this.isSubmitedSend = true;
    let balance = JSON.parse(localStorage.getItem("balance"));
    this.errorSend = "";
    this.successSend = "";
    this.successBring = "";

    if (balance.totalBalance < this.formData.value.amount.replace(/\./g, "")) {
      this.errorSend =
        "No tienes saldo suficiente para realizar esta transacción";
    } else if (this.formData.value.amount.replace(/\./g, "") < 1000) {
      this.errorSend = "El valor mínimo es de $1.000";
    } else if (this.formData.value.amount.replace(/\./g, "") > 1000000) {
      this.errorSend = "El valor máximo es de $1.000.000";
    } else if (this.formData.status == "VALID") {
      this.isLoading = true;

      this.service
        .sendMoneyPoker({
          amount: this.formData.value.amount.replace(/\./g, ""),
          currency: this.formData.value.currency,
          userId: this.formData.value.userId,
        })
        .subscribe(
          (response) => {
            this.isLoading = false;
            this.isSubmitedSend = false;
            this.updateBalance.emit();

            let profile = JSON.parse(localStorage.getItem("profile"));

            this.formData = new FormGroup({
              amount: new FormControl("", [Validators.required]),
              currency: new FormControl("COP", [Validators.required]),
              userId: new FormControl(profile.accountCode, [
                Validators.required,
              ]),
            });
            this.successSend =
              "Se envió el dinero correctamente a tu cuenta de POKER";
          },
          () => {
            this.errorSend =
              "Hubo un error al intentar realizar el envío, valida tu saldo e intenta de nuevo.";
            this.isLoading = false;
          }
        );
    }
  }

  gaEventPokerRecharge(): void {
    const value = this.formData.value.amount.replace('\.', '');

    const event = {
      event: 'ga_event',
      category: 'Poker',
      action: 'BPW - Cajero',
      label: 'Confirmar',
      cantidadIngresada: value
    };
    window.dataLayer.push(event);
  }

  numberFormat(field) {
    var num = this.formData.value[field].replace(/\./g, "");

    if (!isNaN(num)) {
      num = num
        .toString()
        .split("")
        .reverse()
        .join("")
        .replace(/(?=\d*\.?)(\d{3})/g, "$1.");
      num = num.split("").reverse().join("").replace(/^[\.]/, "");
      this.formData.patchValue({
        [field]: num,
      });
    } else {
      this.formData.patchValue({
        [field]: this.formData.value[field].replace(/[^\d\.]*/g, ""),
      });
    }
  }
}
