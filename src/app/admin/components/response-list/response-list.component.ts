import { Component, OnInit } from '@angular/core';
import {BaseListComponent, BaseObject} from "@shared/components/base-list/base-list.component";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {LoaderService} from "@shared/services/loader.service";
import {TranslateService} from "@ngx-translate/core";
import {LIMIT} from "@assets/const";
import * as XLSX from 'xlsx';

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
  filteredObjects: Response[];

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
    this.objectList = resp.map(a => {
      this.loaderService.hide();
      return { id: a.payload.doc.id, ...a.payload.doc.data() } as Response;
    });
    this.filteredObjects = this.objectList;
    return this.filteredObjects;
  }

  onSelectDate(): void{
    if (this.filterDate) {
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
    } else {
      this.objectCollection = this.afs.collection(this.collectionName, (ref) => {
        this.firestoreQuery = ref.limit(LIMIT + 1)
            .orderBy("createdAt", "desc")
        ;
        return this.firestoreQuery;
      });
      this.onAfterLoadData();
    }
  }

  getRating(resp: any): any {
    const keys = Object.keys(resp);
    let rating = 0;
    keys.forEach((key) => {
      if (resp[key].order === 1) {
        rating = resp[key].response;
      }
    })
    return rating;
  }

  exportData(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const now = new Date();
    /* save to file */
    XLSX.writeFile(wb, `export-${now.toLocaleString()}.xls`);
  }

  onSelectStore(e: any): void {
    const value = e.target.value;
    if (value === 'All') {
      this.filteredObjects = this.objectList;
    } else {
      console.log(this.objectList);
      this.filteredObjects = this.objectList.filter((res) => {
        return res.store === value;
      });
    }
  }
}
