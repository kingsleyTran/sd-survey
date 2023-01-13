import {Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup } from "@angular/forms";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {ActivatedRoute, Router} from "@angular/router";
import {LoaderService} from "@shared/services/loader.service";
import {ToastrService} from "ngx-toastr";
import {NEW} from "@assets/const";
import {TranslateService} from "@ngx-translate/core";
import {ImageUploaderComponent} from "@shared/components/image-uploader/image-uploader.component";

@Component({
  selector: 'app-base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.scss']
})
export class BaseFormComponent implements OnInit {

  id: string | null;
  formData: any;
  documentRef: any;
  formGroup: FormGroup;
  collectionName: string = "";

  @ViewChild(ImageUploaderComponent) uploaderComponent: ImageUploaderComponent;

  protected objectCollection: AngularFirestoreCollection<FormGroup>;

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public loaderService: LoaderService,
    public toastrService: ToastrService,
    public translateService: TranslateService,
    protected afs: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.objectCollection = this.afs.collection(this.collectionName);
    const id = this.activatedRoute.snapshot?.params.id || null;
    this.initForm();
    if (id !== NEW) {
      this.id = id;
      this.loadData();
    }
  }

  initForm(): any {
  }

  loadData(): void {
    if (this.id) {
      this.documentRef =  this.objectCollection.doc(this.id);
      this.documentRef.valueChanges().subscribe((item: any) => {
        this.formData = item;
        if (this.formGroup) {
          this.formGroup.patchValue(this.formData);
        }
      })
    } else {
      console.log('id not found');
    }
  }

  onSubmit($event: any): void {
    $event.preventDefault();
    this.loaderService.show();
    if (this.documentRef) {
      this._updateData();
      return;
    }
    this._createNew();
  }

  _updateData(): void {
    this.documentRef.update({
      ...this.formGroup.value,
      updatedAt: Date.now()
    }).then(
      (resp: any) => {
        this.loaderService.hide();
        this.toastrService.success( this.translateService.instant('common.successfully'));
        this.goBack(false);
      }
    ).catch((e: any) => {
      this.loaderService.hide();
      this.toastrService.error(this.translateService.instant('common.failed'));
      console.error(e);
    })
  }

  _createProcess() {
    return this.objectCollection.add({
      ...this.formGroup.value,
      createdAt: Date.now()
    })
  }

  _createNew(): void {
    this._createProcess().then(
        (resp) => {
          this.loaderService.hide();
          this.toastrService.success( this.translateService.instant('common.successfully'));
          this.goBack(false);
        }
    ).catch((e) => {
      this.loaderService.hide();
      this.toastrService.error(this.translateService.instant('common.failed'));
      console.error(e);
    })
  }

  enableSubmitButton() {
    return !this.formGroup.valid;
  }

  goBack(deletePhoto = true) {
    if (this.formGroup.value.photoURL && deletePhoto) {
      // In case upload photo without save, go back will delete image.
      this.uploaderComponent.processDelete();
    }
    this.router.navigate(['..'], {relativeTo: this.activatedRoute});
  }

  onFileChange(fileURL: string) {
    this.formGroup.patchValue({
      photoURL: fileURL
    })
  }
}
