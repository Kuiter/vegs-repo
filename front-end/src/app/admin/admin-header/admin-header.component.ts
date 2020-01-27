import { Component, OnInit } from '@angular/core';
import { AdminUserService } from '../services/admin-user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';

/**
 * Custom header displayed in admin route.
 */
@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  /**Variable that holds data of the authenticated user. */
  user: any;
  /**Switch for waiting on user data before displaying in header template. */
  show = false;
  /**@ignore */
  constructor(private adminUserService: AdminUserService, private http: HttpClient, private router: Router) { }
  /**
   * OnInit livecycle hook for retrieving necessary data.
   */
  ngOnInit() {
    this.adminUserService.getUserInfo().subscribe(
      (user) => {
        this.user = user;
        this.show = true;
      },
      (error) => {
        console.error(error)
      }
    )
  }
  /**
   * OnClick listener for logging out currently logedIn user.
   */
  logout() {
    this.http.get(environment.apiURI + '/logout').subscribe(() => { this.router.navigate(['/']) })
  }

}
