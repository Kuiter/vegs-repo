import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TrialTreatmentService } from '../trial-services/trial-treatment.service';

@Component({
  selector: 'app-treatment-select',
  templateUrl: './treatment-select.component.html',
  styleUrls: ['./treatment-select.component.scss']
})
export class TreatmentSelectComponent implements OnInit {
  /**Databinding for emitting selected treatmentID to parent. */
  @Output() treatmentID: EventEmitter<String> = new EventEmitter();
  /**Treatment selection form */
  treatmentForm = new FormGroup({
    treatment: new FormControl('', Validators.required),
  });

  constructor(private trialTreatmentService: TrialTreatmentService) { }

  ngOnInit() { }

  /**
   * OnClick listener that submits input string and checks if it exists.
   * If it exists 
   * @emits treatmentID
   * if not sets error to form to display, that there is no such treatment.
   * Error also results in not treatment found. No error handling.
   */
  onSubmit() {
    if (this.treatmentForm.valid) {
      this.trialTreatmentService.getSpecificTreatmentData(this.treatmentForm.controls.treatment.value).subscribe(
        (val) => {
          if (!val) {
            this.treatmentForm.controls.treatment.setErrors({ notFound: true });
            return;
          }
          this.treatmentID.emit(val);
        },
        (error) => { this.treatmentForm.controls.treatment.setErrors({ notFound: true }) }
      );
    }
  }

}
