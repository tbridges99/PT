import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { HttpClient, HttpHeaders} from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  file:any;

  constructor(private http:HttpClient) { }
  uploadImage(file){
      console.log(file);
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      return this.http.post('https://localhost:3000/upload',
      file, {headers:headers});
  }
}
