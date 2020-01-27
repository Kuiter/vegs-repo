import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TrialSubjectService } from '../trial-services/trial-subject.service';

/**
 * Subject select comoponent
 * 
 * Used in trial config. Emits result for subject selection OR subject generation to parent element.
 */
@Component({
  selector: 'app-subject-select',
  templateUrl: './subject-select.component.html',
  styleUrls: ['./subject-select.component.scss']
})
export class SubjectSelectComponent implements OnInit {
  /**Holds currently selected treatmentID, for use in checking if trial already exists. */
  treatmentID: any;
  /**Form for selecting subject by ID. */
  subjectForm = new FormGroup({
    subjectID: new FormControl('', Validators.required)
  });
  /**Submit Button disabled switch. */
  btnDisabled = true;
  /**Databinding to parent for subjectID emission. */
  @Output() selected = new EventEmitter<string>();
  /**Databinding for recieving treatmentID from parent. */
  @Input('tID') set tID(id) {
    this.btnDisabled = false;
    this.treatmentID = id;
  }

  constructor(private trialSubjectService: TrialSubjectService) { }
  /**
   * Not really needed anymore because component is hidden while treatmentID is not selected
   */
  ngOnInit() {
    if (!this.treatmentID) {
      this.btnDisabled = true;
      // this.subjectForm.invalid;
    }
  }
  /**
   * OnClick Form submission.
   * Checks if subject and treatment --> subject select fails if not subjectID is emited to parent
   * @emits subjectID
   */
  onSubmit() {
    this.trialSubjectService.checkDataRecording(this.treatmentID, this.subjectForm.controls.subjectID.value)
      .subscribe(
        (val) => {
          // already exists
          this.subjectForm.controls.subjectID.setErrors({ trial: true })
        },
        (error) => {
          //
          if (error.error.noTrial) {
            this.selected.emit(this.subjectForm.controls.subjectID.value)
          }
          console.error(error);
        }
      );
  }
  /**
   * OnClick listener for creating a subject.
   * Calls service for generating subject, after success emits subjectID to parent.
   * @emits subjectID
   */
  generateSubject() {
    if (!this.treatmentID) {
      return;
    }
    this.trialSubjectService.generateNewSubject(this.treatmentID).subscribe((val: string) => {
      this.selected.emit(val);
    })
  }
}
