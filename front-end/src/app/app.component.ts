import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { environment } from 'src/environments/environment';

/**
 * App component
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() {}

  title = 'VEGS';
}
