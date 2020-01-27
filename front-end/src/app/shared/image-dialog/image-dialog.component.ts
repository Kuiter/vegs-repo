import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { ImageService } from '../services/image.service';

/**
 * Mat-dialog for uploading an image to Label/Item
 */
@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit {
  /**Variable for image file "blob" */
  selectedFile: File;
  /**image path variable. */
  public imagePath;
  imgURL: any[] = [];
  // @Input() host: any;
  /** Switch for data loading, true after ngOnInit has run. */
  show: boolean;
  /**Switch for displaying error MaxFileSize */
  maxFileSize: boolean = false;
  /**Switch for displaying upload button if no errors are present. */
  showUpload: boolean = false;
  // show = false;
  /**FormData reference for sending image data to API. */
  formData: FormData;
  /**Image display option. */
  bg = 'contain';
  /**Image display height option. */
  h = '248px';
  /**
   * Constructor for Mat-Dialog for adding image either to Item, Label.
   * @param dialogRef 
   * @param data 
   * @param imageService 
   */
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private imageService: ImageService
  ) { }

  /**
   * OnInit Livecycle hook, dicides item or label has image, 
   * if yes display image if not display palceholder image.
   */
  ngOnInit() {
    console.log(this.data);
    if (this.data.ref == 'item') {
      if (this.data.item.image == undefined) {
        this.imgURL.push('assets/placeholder/placeholder-images-image_large.png');
      } else {
        this.imgURL.push(environment.apiURI + '/images/' + this.data.item.image.full);
      }
    } else if (this.data.ref == 'label') {
      if (!this.data.item.img) {
        this.imgURL.push('assets/placeholder/placeholder-images-image_large.png');
      } else {
        this.imgURL.push(environment.apiURI + '/image/label/' + this.data.item._id);
      }
    } else {

    }
    this.show = true;
  }
  /**
   * @ignore
   */
  get environment() {
    return environment;
  }
  /**
   * @ignore
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
  /**
   * Function for displaying a preview image in template.
   * @param event 
   */
  preview(event) {
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.message = "Only images are supported.";
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      if (_event.loaded > environment.maxFileSizeBits) {
        this.maxFileSize = true;
        return;
      }
      if (this.show) {
        this.imgURL[0] = reader.result;
      } else {
        if (this.imgURL[0] == './assets/traktor_placeholder.jpeg') {
          this.imgURL[0] = reader.result;
        } else {
          this.imgURL.push(reader.result);
        }
      }
      this.showUpload = true;
    };
    this.selectedFile = event.target.files[0];
  }
  /**
   * Not used yet... 
   * @param img 
   */
  removeImg(img) {
    if (this.imgURL.length === 0) {
      return;
    } else if (this.imgURL.length === 1) {
      this.imgURL.push('./assets/traktor_placeholder.jpeg')
    }
    this.imgURL.splice(this.imgURL.findIndex(x => x === img), 1);
    if (this.imgURL.length !== 1) {}
  }
  /**
   * Function for handling image upload for Item, Label.
   * @param imgURL 
   */
  upload(imgURL) {
    this.formData = new FormData();
    if (this.data.ref == 'item') {
      this.formData.append('itemID', this.data.item._id);
      this.formData.append('image', this.selectedFile);
      this.showUpload = false;
      this.imageService.uploadImageToItem(this.formData).subscribe(
        () => {},
        (error) => {
          console.error(error);
        }
      );
    } else if (this.data.ref == 'label') {
      this.formData.append('labelID', this.data.item._id);
      this.formData.append('image', this.selectedFile);
      this.showUpload = false;
      this.imageService.uploadImageToLabel(this.formData).subscribe(
        () => {},
        (error) => {
          console.error(error);
        }
      );
    }
  }
}
