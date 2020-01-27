import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * @todo Alles
 */
@Component({
  selector: 'app-subject-manage',
  templateUrl: './subject-manage.component.html',
  styleUrls: ['./subject-manage.component.scss']
})
export class SubjectManageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onBack() {
    this.router.navigate(['/admin']);
  }
}
