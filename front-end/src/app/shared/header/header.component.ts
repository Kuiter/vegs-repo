import { Component, OnInit } from '@angular/core';
import { TrialSubjectService } from 'src/app/trial/trial-services/trial-subject.service';
import { TrialTreatmentService } from 'src/app/trial/trial-services/trial-treatment.service';
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
/**
 * Header displayed in shop.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  /**Specifies shop name on html. */
  titel = 'Shop';

  /**
   * @ignore 
   */
  constructor(
    private treatmentService: TrialTreatmentService,
    private subjectService: TrialSubjectService,
  ) { }

  ngOnInit() {
  }

  get baseURL() {
    return `/t/${this.treatmentService.getTreatmentID()}/s/${this.subjectService.getSubjectID()}/shop/products`
  }
}
