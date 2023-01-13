import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FileHandle} from "@shared/directives/drag-drop.directive";
import { DomSanitizer } from '@angular/platform-browser';
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {LoaderService} from "@shared/services/loader.service";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {

  @Output() uploadedFile: EventEmitter<string> = new EventEmitter();

  constructor(
    private sanitizer: DomSanitizer,
    private storage: AngularFireStorage,
    public loaderService: LoaderService,
  ) { }

  ngOnInit(): void {
  }

  files: FileHandle[] = [];

  @Input()
  imgURL: string | undefined;

  filesDropped(files: FileHandle[]): void {
    // Currently, we accept only 1 file.
    this.files = [files[0]];
    console.log(this.files);
    this.upload();
  }

  onFileChange(evt: any):void {
    let files: FileHandle[] = [];
    const file = evt.target.files[0];
    if (!file) return;
    const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
    files.push({ file, url });
    this.files = files;
    this.upload();
  }

  upload(): void {
    if (!this.files || this.files.length === 0) return;
    this.loaderService.show();
    const uploadFile = this.files[0].file;
    console.log('------- uploadFile', uploadFile);
    const ref = this.storage.ref(`uploads/${uploadFile.name}${Date.now()}`);
    ref.put(uploadFile).then(() => {
      ref.getDownloadURL().subscribe((url) => {
        this.imgURL = url;
        this.uploadedFile.emit(url);
      });
      this.loaderService.hide();
    });
  }

  deleteFile(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.processDelete();
        Swal.fire(
          'Deleted!',
          'The item has been deleted.',
          'success'
        )
      }
    })
  }

  public processDelete() {
    if (!this.imgURL) return;
    this.loaderService.show();
    this.storage.refFromURL(this.imgURL).delete();
    this.imgURL = undefined;
    this.uploadedFile.emit('');
    this.files = [];
    this.loaderService.hide();
  }

}
