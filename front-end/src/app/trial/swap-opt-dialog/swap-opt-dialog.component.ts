import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { TrialTreatmentService } from '../trial-services/trial-treatment.service';
import { EventsService } from '../trial-services/events.service';

@Component({
  selector: 'app-swap-opt-dialog',
  templateUrl: './swap-opt-dialog.component.html',
  styleUrls: ['./swap-opt-dialog.component.scss']
})
export class SwapOptDialogComponent implements OnInit {

  remember: FormGroup;
  submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SwapOptDialogComponent>,
    private trialTreatmentService: TrialTreatmentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eventsService: EventsService
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.remember = new FormGroup({
      rememberMyAnswer: new FormControl(false)
    })
  }

  get swapConfig() {
    return this.trialTreatmentService.getSwapConfig();
  }

  /**
   * Click listener activated by buttons in template "Ja", "Nein"
   * @param bol 
   */
  onSubmit(bol: boolean) {
    this.dialogRef.disableClose = false;
    this.submitted = true;
    const { rememberMyAnswer } = this.remember.value;
    const { showSwaps, showSwapEnd, showOptInStart, showOptInEachTime } = this.trialTreatmentService.getSwapConfig();
    if (showSwaps && (showOptInStart && showSwapEnd) || showOptInStart) {
      localStorage.setItem('rememberStart', bol.toString());
    }
    if (rememberMyAnswer && showOptInEachTime) {
      localStorage.setItem('remember', bol.toString());
    }
    const data = {
      sourceItem: !this.data.item ? '' : this.data.item._id,
      rememberMyAnswer,
      result: bol
    }
    this.eventsService.recordOptIn(data).subscribe(
      () => {
        this.onNoClick(bol);
      }
    )
    // this.onNoClick(bol);
    // handle recording of swap Opt events... 
  }

  /**
   * @ignore
   */
  onNoClick(bol): void {
    this.dialogRef.close(bol);
  }

}
