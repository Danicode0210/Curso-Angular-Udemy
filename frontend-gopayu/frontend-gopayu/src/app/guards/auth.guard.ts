import { Injectable } from '@angular/core';
import { 
        Router,
        ActivatedRouteSnapshot,
        RouterStateSnapshot,
        CanActivate
    }  from "@angular/router";


@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private router:Router) { }

  canActivate(next:ActivatedRouteSnapshot, state: RouterStateSnapshot ){

    /* Validate session and route to redirect or stay */
    if( localStorage.getItem("session") )
    {   
        this.router.navigate(['/']);
        /* Stay */
        return false;
    }
    else 
    {
        return true;
    }
  }

}
