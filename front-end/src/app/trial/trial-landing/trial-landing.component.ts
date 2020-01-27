import { Component } from '@angular/core';
import { TrialTreatmentService } from '../trial-services/trial-treatment.service';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * Trial Landing Component
 * 
 * Redirect target after trial is started. 
 * 
 * {@link TrialLandingTodo}
 * categories selection 
 * featured items display 
 * infor at bottom... 
 */
@Component({
  selector: 'app-trial-landing',
  templateUrl: './trial-landing.component.html',
  styleUrls: ['./trial-landing.component.scss']
})
export class TrialLandingComponent {

  constructor(
    private trialTreatmentService: TrialTreatmentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  /**
   * OnClick listener for routing to products page.
   * Performs sanity check if all information is present before routing.
   * [deprecated]{@link deprecated}
   */
  routeToProducts() {
    if (!this.trialTreatmentService.checkRoute()) {
      this.router.navigate(['products'], { relativeTo: this.route });
      return;
    }
    this.router.navigate(['products'], { relativeTo: this.route });
  }

}
