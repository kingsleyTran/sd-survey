import { Component, OnInit } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {BaseListComponent, BaseObject} from "@shared/components/base-list/base-list.component";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {LoaderService} from "@shared/services/loader.service";
import {TranslateService} from "@ngx-translate/core";

export interface Question extends BaseObject{
  id: string;
  question: string;
  type: string;
  isRequired: boolean;
  options: string[];
  createdAt: number;
  order: number;
}

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent extends BaseListComponent {
  collectionName: string = "questions";
  protected objectCollection: AngularFirestoreCollection<Question>;
  objectList: Question[];

  typeLabel: any = {
    'text': 'Text',
    'textarea': 'Long text',
    'rating': 'Rating',
    'multi-select': 'Multi Select',
    'contact-form': 'Contact Form'
  }

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
      return { id: a.payload.doc.id, ...a.payload.doc.data() } as Question;
    });
  }
}
