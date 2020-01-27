import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

/**
 * Popover modal for displaying additional information.
 * Can handle information for Label, Score, Taxes.
 * Implemented as a mat-dialog.
 */
@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent implements OnInit {
  /**Switch for determining if an image needs to be shown, only if information is connected to a label. */
  showImg = false;

  constructor(
    public dialogRef: MatDialogRef<InfoDialogComponent>,
    /**Data holds the additional data to be displayed, either of ObjectModel Tax, Label, Score. */
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  /**Setup logic to determine what should be displayed. */
  ngOnInit() {
    if (this.data.object) {
      if (!this.data.object.img) {
        this.showImg = false;
      }
      console.log(this.data.object);
      // let blob = new Blob(this.data.object.img.data.data, {type: this.data.object.img.data.type});
      // this.createImageFromBlob(blob);
      this.showImg = true;
    } else { }
  }
  /**@ignore */
  get environment() {
    return environment;
  }

  // createImageFromBlob(image: Blob) {
  //   let reader = new FileReader();
  //   reader.addEventListener("load", () => {
  //     this.imageBlobUrl = reader.result;
  //   }, false);
  //   if (image) {
  //     reader.readAsDataURL(image);
  //   }
  // }
  /**@ignore */
  onNoClick(): void {
    this.dialogRef.close();
  }
}
