import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  collapsed = true;
  private userSub: Subscription;
  loggedUserName: string;
  constructor(private authService: AuthService, private sharedService: SharedService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    
    this.userSub = this.authService.user.subscribe((userData) => {
      if(userData){
        this.loggedUserName = userData.email.split('@')[0].toUpperCase();
      }
      this.isAuthenticated = !userData;
   
    });
  }
  onLogout() {
    this.authService.logout();
    this.sharedService.showMessageAfterSucces();
  }


  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
