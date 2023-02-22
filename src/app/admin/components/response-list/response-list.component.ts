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
  filterDate: any;
  startTimeStamp: number;
  endTimeStamp: number;

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

  onSelectDate(): void{
    this.firstItem = null;
    const now = new Date();
    now.setFullYear(this.filterDate.year);
    now.setMonth(this.filterDate.month - 1);
    now.setDate(this.filterDate.day);

    const startTime: any = now;
    startTime.setHours(0);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    this.startTimeStamp = Math.floor(startTime);

    const endNow = new Date();
    endNow.setFullYear(this.filterDate.year);
    endNow.setMonth(this.filterDate.month - 1);
    endNow.setDate(this.filterDate.day);
    const endTime: any = endNow;
    endTime.setHours(23);
    endTime.setMinutes(59);
    endTime.setSeconds(59);

    this.endTimeStamp = Math.floor(endTime);

    this.firstResponse = null;
    this.lastResponse = null;
    const searchQuery = this.firestoreQuery.where(
        'createdAt', '<', this.endTimeStamp
    ).where(
        'createdAt', '>=', this.startTimeStamp
    );
    this.objectCollection = this.afs.collection(this.collectionName, () => searchQuery);
    this.disableGoNext = false;
    this.onAfterLoadData();
  }
}
