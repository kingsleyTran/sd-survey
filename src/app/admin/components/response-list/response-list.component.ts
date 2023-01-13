import { Component, OnInit } from '@angular/core';
import {BaseListComponent, BaseObject} from "@shared/components/base-list/base-list.component";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {LoaderService} from "@shared/services/loader.service";
import {TranslateService} from "@ngx-translate/core";

export interface Response extends BaseObject{
  id: string;
  name: string;
  phone: string;
  email: string;
  googleReview: boolean;
  response: any;
  createdAt: number;
  order: number;
  store: string;
  feedback: string;
}

export const reviewHash: any = {
  'penrith': 'Penrith',
  'ns': 'North Strathfield',
  'campbelltown': 'Campbelltown'
}

@Component({
  selector: 'app-response-list',
  templateUrl: './response-list.component.html',
  styleUrls: ['./response-list.component.scss']
})
export class ResponseListComponent extends BaseListComponent {
  collectionName: string = "responses";
  protected objectCollection: AngularFirestoreCollection<Response>;
  objectList: Response[];
  reviewHash = reviewHash;

  constructor(
      protected afs: AngularFirestore,
      protected activatedRoute: ActivatedRoute,
      protected router: Router,
      protected storage: AngularFireStorage,
      public loaderService: LoaderService,
      public translateService: TranslateService
  ) {
    super(afs, activatedRoute, router, storage, loaderService, translateService);
  }

  mappingResponse(resp: any[]) {
    return this.objectList = resp.map(a => {
      this.loaderService.hide();
      return { id: a.payload.doc.id, ...a.payload.doc.data() } as Response;
    });
  }
}
