import { MatDialogRef } from '@angular/material';
import { MenuService } from 'src/app/services/menu.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-history',
  templateUrl: './menu-history.component.html',
  styleUrls: []
})
export class MenuHistoryComponent implements OnInit {

  public type:number = 0;
  public filter:number = 1;
  public months:Array<number> = new Array();
  public days:Array<number> = new Array();
  public years:Array<number> = new Array();
  public year:any = new Date().getFullYear();
  public transactions:any;
  public isLoading:boolean = false;
  public gameType:string = '';
  public money:string = '';
  private moment = require("moment");
  public transactionType:string = '';
  public fechaIniYear:string = '';
  public fechaIniMonth:string = '';
  public fechaIniDay:string = '';
  public fechaFinYear:string = '';
  public fechaFinMonth:string = '';
  public fechaFinDay:string = '';
  public textBotonTransacciones = 'Transacciones';
  public textBotonGestionJuego = 'Gestion De Juegos';
  public textBotonResumenAnual = 'Resumen Anual';
  public textBotonUltimoMes = 'Ultimo Mes';
  public textBotonEspecifico = 'Especifico';
  public textBotonTodosLosDatos = 'Todos Los Datos';
  public textBotonVerTransacciones = 'Ver Transacciones';
  public textSelectTransactionTypes = {
    BonusGrant : 'Asignación De Bono',
    BonusCancelation : 'Cancelacion De Bono',
    PointsGrant : 'Asignación De Puntos',
    PointsExchange : 'Intercambio De Puntos',
    Deposit : 'Depositos',
    DepositCancelation : 'Cancelacion De Depositos',
    Withdrawal : 'Retiros',
    WithdrawalCancelation : 'Cancelacion De Retiro',
    WithdrawalRejection : 'Rechazo De Retiro',
    Bet : 'Apuesta',
    BetCancelation : 'Cancelacion De Apuesta',
    Winning : 'Ganancias',
    WinningCancelation : 'Ganancia Cancelada',
    BonusConversion : 'Conversion De Bono',
    FreeBetGrant : 'Asignacion De Freebet',
    FreeBetCancelation : 'Cancelacion De Freebet'
  };
  public transactionNames = {
    'BonusGrant' : 'Asignación de bono',
    'BonusCancelation' : 'Cancelación de bono',
    'PointsGrant' : 'Asignación de puntos',
    'PointsExchange' : 'Intercambio de puntos',
    'Deposit' : 'Depositos',
    'DepositCancelation' : 'Cancelación de depositos',
    'Withdrawal' : 'Retiros',
    'WithdrawalCancelation' : 'Cancelación de retiro',
    'WithdrawalRejection' : 'Rechazo de retiro',
    'Bet' : 'Apuesta',
    'BetCancelation' : 'Cancelación de apuesta',
    'Winning' : 'Ganancias',
    'WinningCancelation' : 'Ganancia cancelada',
    'BonusConversion' : 'Conversión de bono',
    'FreeBetGrant' : 'Asignación de freebet',
    'FreeBetCancelation' : 'Cancelación de freebet'
  };

  public paginationOptions:any = {
    length:0,
    pageIndex: 0,
    pageSize: 5,
    previousPageIndex: 1
  }
  public defaultPaginationOptions:any = {
    length:0,
    pageIndex: 0,
    pageSize: 5,
    previousPageIndex: 1
  }
  
  constructor(private service:MenuService, private dialogRef:MatDialogRef<MenuHistoryComponent>) { }

  ngOnInit() {
    this.initMonths();
    this.initDays();
    this.initYears();
  }

  closeModal()
  {
    this.dialogRef.close();
  }

  initMonths()
  {
      for(let i = 1; i <= 12; i++)
      {
          this.months.push(i);
      }
  }
  initYears()
  {   
      for(let i = 2012; i <= new Date().getFullYear(); i++)
      {
          this.years.push(i);
      }
  }
  initDays()
  {
      for(let i = 1; i <= 31; i++)
      {
          this.days.push(i);
      }
  }

  showTransactions(event)
  {     
      this.paginationOptions = event;
      this.gaEventHistoryViewTransactions();
      /* Validate type */
      if(this.type == 3) 
      { 
          this.isLoading = true;
          /// Get yearly transactions
          this.service.getYearlyTransactions(this.year)
          .subscribe((response:any) => {
              this.transactions = response;
              this.isLoading = false;
          },
          () => {
            this.isLoading = false;
          });
      }
      else 
      {   
          var mtype = '';
          var startDateTime = '';
	        var endDateTime = '';
	        var mtype = "";
	        var gt = "";
	        var mdate = "";

          if (this.money != '')
          {
              mtype = "moneyType="+this.money+"&";
          }
          if (this.type == 2 && this.gameType != '') 
	        {
	        	  gt = '&gameType='+this.gameType;
	        }  

          if (this.filter == 1)
	        {	
	        	endDateTime =	this.moment(new Date()).toISOString();
	        	startDateTime = this.moment(new Date().getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString();
	        	mdate = "&startDateTime="+startDateTime+"&endDateTime="+endDateTime;
	        }
	        else if(this.filter == 2)
	        {
	        	  startDateTime = this.moment(this.fechaIniYear+'-'+this.fechaIniMonth+'-'+this.fechaIniDay).toISOString();
	        	  endDateTime = this.moment(this.fechaFinYear+'-'+this.fechaFinMonth+'-'+this.fechaFinDay).toISOString();
	        	  mdate = "&startDateTime="+startDateTime+"&endDateTime="+endDateTime;
	        }

          this.isLoading = true;
          /// Get yearly transactions
          this.service.getTransactions(mtype, this.transactionType, mdate, gt, this.paginationOptions.pageSize, (this.paginationOptions.pageIndex+1))
          .subscribe((response:any) => {
              this.transactions = response;
              this.paginationOptions.length = response.totalItems;
              this.isLoading = false;
          },
          () => {
            this.isLoading = false;
          });
      }
  }

  gaEventHistoryViewTransactions(): void {
    let tipoTransaccion;
    let transaccionPorPagina;
    let monedero;
    let resumenAnual;
    if (this.type === 3) {
      resumenAnual = this.year;
    } else {
      tipoTransaccion = this.transactionType === '' ? 'Todas las transacciones' : this.textSelectTransactionTypes[this.transactionType];
      transaccionPorPagina = this.paginationOptions.pageSize;
      monedero = this.money;
    }
    const event = {
      event: 'ga_event',
      category: 'Perfil usuario',
      action: 'BPW - Historial',
      label: this.textBotonVerTransacciones,
      tipoTransaccion: tipoTransaccion,
      transaccionPorPagina: transaccionPorPagina,
      monedero: monedero,
      tipoDeJuego: this.type === 2 ? (this.gameType === '' ? 'Todos' : this.gameType) : undefined,
      resumenAnual: resumenAnual
    };
    window.dataLayer.push(event);
  }

  gaEventHistoryOptions(labelButton: string): void {
    const event = {
      event: 'ga_event',
      category: 'Perfil usuario',
      action: 'BPW - Historial',
      label: labelButton
    };
    window.dataLayer.push(event);
  }

  onClickHistoryOptions(clickEvent: any): void {
    const buttonId = clickEvent.target.attributes.id.nodeValue;
    if (buttonId === 'button1') {
      this.type = 1;
      this.gaEventHistoryOptions(this.textBotonTransacciones);
    } else if (buttonId === 'button2') {
      this.type = 2;
      this.gaEventHistoryOptions(this.textBotonGestionJuego);
    } else if (buttonId === 'button3') {
      this.type = 3;
      this.gaEventHistoryOptions(this.textBotonResumenAnual);
    } else if (buttonId === 'button4') {
      this.filter = 1;
      this.gaEventHistoryOptions(this.textBotonUltimoMes);
    } else if (buttonId === 'button5') {
      this.filter = 2;
      this.gaEventHistoryOptions(this.textBotonEspecifico);
    } else {
      this.filter = 3;
      this.gaEventHistoryOptions(this.textBotonTodosLosDatos);
    }
  }
}
