import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router';
import {UploadService} from '../../services/upload.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';


const URL = 'https://localhost:3000/upload';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  file:String;
  username:String;
  password:String;

  user = {
        username:this.username,
        password:this.password
  }
  constructor(private uploadService: UploadService, private authService:AuthService, private flashMessage:FlashMessagesService, private router:Router) { }

  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'file'});

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
         alert('File uploaded successfully');
        };
    }

  onImageSubmit(){
      const image = {file:this.file}
      this.uploadService.uploadImage(image).subscribe((data:any) => {
          if(data.success){
              this.flashMessage.show("Profile image changed",
                  {cssClass: 'alert-success', timeout:5000});
              this.router.navigate(['profile']);

          }
          else{
              this.flashMessage.show(data.msg,
                  {cssClass: 'alert-danger', timeout:5000});
              this.router.navigate(['dashboard']);
          }
    });
  }
}
