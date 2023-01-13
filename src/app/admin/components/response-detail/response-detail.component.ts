import { Component } from '@angular/core';
import {BaseFormComponent} from "@shared/components/base-form/base-form.component";
import {Response} from "../response-list/response-list.component";
import {FormGroup} from "@angular/forms";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {ActivatedRoute, Router} from "@angular/router";
import {LoaderService} from "@shared/services/loader.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {Subscriber} from "rxjs";

@Component({
  selector: 'app-response-detail',
  templateUrl: './response-detail.component.html',
  styleUrls: ['./response-detail.component.scss']
})
export class ResponseDetailComponent extends BaseFormComponent {

  formData: Response | null;
  formGroup: FormGroup;
  collectionName: string = "responses";
  subscriber$: Subscriber<any>;
  data: any[] = [];

  protected objectCollection: AngularFirestoreCollection<FormGroup>;

  constructor(
      public router: Router,
      public activatedRoute: ActivatedRoute,
      public loaderService: LoaderService,
      public toastrService: ToastrService,
      public translateService: TranslateService,
      protected afs: AngularFirestore
  ) {
    super(router, activatedRoute, loaderService, toastrService, translateService, afs);
  }

  loadData(): void {
    if (this.id) {
      this.documentRef = this.objectCollection.doc(this.id);
      this.subscriber$ = this.documentRef.valueChanges().subscribe((item: any) => {
        this.formData = item;
        this.data = this.mappingResponse();
      });
    } else {
      console.log('id not found');
    }
  }

  mappingResponse() {
    if (this.formData) {
      let data = Object.keys(this.formData.response).map((res) => {
        return this.formData?.response[res]
      });
      data.sort((a: any, b: any) => {
        return parseInt(a.order) - parseInt(b.order);
      });
      this.subscriber$.unsubscribe();
      return data;
    }
    return [];
  }

  parseResponse(response: any) {
    if (typeof(response) === 'string') {
      return response;
    }
    if (Array.isArray(response)) {
      return response.join(', ');
    }
    if (typeof(response) === 'object') {
      return `Name: ${response.name}
        Email: ${response.email}
        Phone: ${response.phone}`
    }
    return JSON.stringify(response);
  }
}

