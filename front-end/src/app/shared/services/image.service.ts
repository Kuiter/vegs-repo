import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
/**
 * Image upload: Service for providing API requests to components.
 */
@Injectable({
  providedIn: 'root'
})
export class ImageService {
  /**@ignore */
  constructor(private http: HttpClient) { }
  /**
   * Upload Image to Item function
   * @param body 
   */
  uploadImageToItem(body) {
    return this.http.post(environment.apiURI + '/add/image', body);
  }
  /**
   * Upload image to lable function.
   * @param body 
   */
  uploadImageToLabel(body) {
    return this.http.post(environment.apiURI + '/label/image', body);
  }
}
