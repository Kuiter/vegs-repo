import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrialTreatmentService } from '../trial-services/trial-treatment.service';
import { TrialSubjectService } from '../trial-services/trial-subject.service';

/**
 * Trial Config Component
 * 
 * Here trials can be manually or automatically configured.
 * Icorporates components that handle treatment selection and subject selection / or generation.
 * 
 * Automatic treatment configuration can be done by provding a Link in form of 
 *              <baseurl>/t/<treatmentID>?genSubject=yes
 * With this the subject is automatically generated and the treatment is started. 
 */
@Component({
  selector: 'app-trial-config',
  templateUrl: './trial-config.component.html',
  styleUrls: ['./trial-config.component.scss']
})
export class TrialConfigComponent implements OnInit {
  /**Holds current treatmentID */
  id: string;
  /**Holds current subjectID */
  subjectID: string;
  /**Not sure if needed! */
  idLater = false;
  /**Switch for displaying treatment selection form (treatment-select.component) */
  showSelectForm = false;
  /**Switch for displaying subject select form (subject-select.component) */
  showSubjectSelect = false;
  /**Switch for disabling display while auto gen subject */
  show = false;
  deviceHeight: number;
  deviceWidth: number;



  constructor(
    private activatedRoute: ActivatedRoute,
    private trialTreatmentService: TrialTreatmentService,
    private trialSubjectService: TrialSubjectService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  /**
   * Checks if treatment id was already specified in URL, if not display app-treatment-select, 
   * if yes only display app-subject-select component.
   * 
   * If QueryString "genSubject=yes" is present Subject is automatically generated and redirected to questionnaire start.
   */
  ngOnInit() {
    if (this.route.snapshot.queryParamMap.get('genSubject') == null) { this.show = true }
    const id = this.activatedRoute.snapshot.paramMap.get('treatmentID');
    if (!id) {
      this.idLater = true;
      this.showSelectForm = true;
      return;
    }
    this.deviceWidth = window.innerWidth; 
    this.deviceHeight = window.innerHeight;
    this.id = id;
    this.showSelectForm = false;
    this.showSubjectSelect = true;
    this.activatedRoute.queryParams.subscribe(async (params) => {
      if (params.genSubject == 'yes') {
        this.subjectID = <string>await this.trialSubjectService.generateNewSubject(this.id).toPromise();
        this.startTrial();
      } else if (params.genSubject == 'swap') {
        this.subjectID = <string>await this.trialSubjectService.generateNewSubject(this.id).toPromise();
        this.startTrial();
      }
    });
  }

  /**
   * Output event listener from app-subject-select
   * recieves the subjectID
   * @param {string} event 
   */
  selected(event) {
    this.subjectID = event;
    this.idLater = false;
    this.showSubjectSelect = false;
  }

  /**
   * Routes to waiting screen where button is displayed for starting the trial.
   */
  async startTrial() {
    // start trial with treatment id and subject id
    try{
      await this.trialTreatmentService.checkIfTreatmentActive(this.id).toPromise();
      let trial = await this.trialTreatmentService.startTreatment(this.id, this.subjectID, {deviceHeight: this.deviceHeight, deviceWidth: this.deviceWidth}).toPromise();
      if (this.activatedRoute.snapshot.queryParamMap.has('quest')) {
        this.router.navigate([`/t/${this.id}/s/${this.subjectID}/q1`]);
      } else {
        this.router.navigate(['/t/' + this.id + '/s/' + this.subjectID + '/shop/products']);
      }
    } catch (error) {
      console.error(error);
      this.router.navigate(['/inactive']);
    }
  }
  /**
   * Only implemented to start a trial with preceeding questionnaire.
   */
  startTrialQuestionnaire() {
    // create trial
  }

  /**
   * Event listener for data binding to app-treatment-select component
   * @param treatmentData 
   */
  setUpTreatment(treatmentData) {
    // you could cache the treatment data... 
    this.id = treatmentData._id;
    // this.idLater = false;
    this.showSelectForm = false; 
    this.showSubjectSelect = true;
  }
}
