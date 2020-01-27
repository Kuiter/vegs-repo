import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TrialSubjectService } from '../trial-services/trial-subject.service';

/**
 * @ignore
 */
@Component({
  selector: 'app-start-trial',
  templateUrl: './start-trial.component.html',
  styleUrls: ['./start-trial.component.scss']
})
export class StartTrialComponent implements OnInit {

  treatmentID = this.activatedRoute.snapshot.params.treatmentID;
  subjectID = this.activatedRoute.snapshot.params.subjectID;

  showFinished = false;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private trialSubject: TrialSubjectService) { }

  ngOnInit() {
  }

  startTrial() {
    this.http.post(environment.apiURI + '/start/trial/' + this.treatmentID + '/' + this.subjectID, {}).subscribe(
      (trial: any) => {
        if(trial.finished) {
          this.showFinished = true;
        }
        this.trialSubject.recording = true;
        this.router.navigate(['/t/' + this.treatmentID + '/s/' + this.subjectID + '/shop/products']);
      },
      (error) => { console.error(error) }
    )
  }
}
