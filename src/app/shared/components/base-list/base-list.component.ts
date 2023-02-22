import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, Query} from '@angular/fire/compat/firestore';
import {Observable, take} from 'rxjs';
import {ActivatedRoute, Router} from "@angular/router";
import {LoaderService} from "@shared/services/loader.service";
import {LIMIT} from "@assets/const";
import Swal from 'sweetalert2'
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {TranslateService} from "@ngx-translate/core";


export interface BaseObject {
  id: string;
  createdAt: number;
}

@Component({
  selector: 'app-base-list',
  templateUrl: './base-list.component.html',
  styleUrls: ['./base-list.component.scss']
})
export class BaseListComponent implements OnInit {

  protected objectCollection: AngularFirestoreCollection<BaseObject>;
  objectList: BaseObject[];
  subscriber$: Observable<any[]>
  searchKeyword: string = "";
  isEmpty = true;
  firestoreQuery: Query;
  collectionName: string = "";
  // For pagination
  firstItem: any = null;
  firstResponse: any = null;
  firstItems: any[] = [];
  currentPage: number = 0;
  lastResponse: any = null;
  disableGoNext: boolean = false;
  disableGoBack: boolean = true;

  constructor(
      protected afs: AngularFirestore,
      protected activatedRoute: ActivatedRoute,
      protected router: Router,
      protected storage: AngularFireStorage,
      public loaderService: LoaderService,
      public translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.objectCollection = this.afs.collection(this.collectionName, (ref) => {
      this.firestoreQuery = ref.limit(LIMIT + 1)
        .orderBy("createdAt", "desc")
      ;
      return this.firestoreQuery;
    });
    this.onAfterLoadData();
  }

  openNewForm(): void {
    this.router.navigate(['./new'], { relativeTo: this.activatedRoute });
  }

  openDetailForm(id: string): void {
    this.router.navigate([`./${id}`], { relativeTo: this.activatedRoute });
  }

  deleteItem(id: string, imageURL?: string): void {
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
        // Delete image first
        if (imageURL) {
          try {
            this.storage.storage.refFromURL(imageURL).delete();
          } catch (e) {
            console.log('e', e);
          }
        }
        this.afs.collection(this.collectionName).doc(id).delete();
        Swal.fire(
            'Deleted!',
            'The item has been deleted.',
            'success'
        )
        if (id === this.firstItem.id || !this.firstItem) {
          this.disableGoBack = true;
        }
      }
    })
  }

  search(): void {
    this.firstItem = null;
    this.firstResponse = null;
    this.lastResponse = null;
    const searchQuery = this.firestoreQuery.where(
        'name', '>=', this.searchKeyword
    ).where(
        'name', '<=', this.searchKeyword + '\uf8ff'
    );
    this.objectCollection = this.afs.collection(this.collectionName, () => searchQuery);
    this.disableGoNext = false;
    this.disableGoBack = true;
    this.onAfterLoadData();
  }

  prevPage() {
    this.currentPage -= 1;
    const prevQuery = this.firestoreQuery.startAt(this.firstItems[this.currentPage]);
    this.objectCollection = this.afs.collection(this.collectionName, () => prevQuery);
    this.disableGoNext = false;
    this.onAfterLoadData(false);
  }

  nextPage() {
    this.currentPage += 1;
    const nextQuery = this.firestoreQuery.startAfter(this.lastResponse);
    this.objectCollection = this.afs.collection(this.collectionName, () => nextQuery);
    this.disableGoBack = false;
    this.onAfterLoadData(true);
  }

  mappingResponse(resp: any[]) {
    return this.objectList = resp.map(a => {
      this.loaderService.hide();
      return { id: a.payload.doc.id, ...a.payload.doc.data() } as BaseObject;
    });
  }

  protected onAfterLoadData(isGoNext = true) {
    this.loaderService.show();
    const subscriber = this.objectCollection.snapshotChanges().pipe(take(1)).subscribe((resp) => {
      this.isEmpty = !resp.length;
      if (this.isEmpty) return;
      if (!this.firstItem) {
        this.firstItem = resp[0].payload.doc;
      } else {
        this.disableGoBack = this.firstItem.id === resp[0].payload.doc.id;
      }
      this.disableGoNext = resp.length <= LIMIT;
      if (isGoNext && this.firstResponse) {
        const existedItem = this.firstItems.filter((item) => {
          return item.id === this.firstResponse.id
        });
        if (existedItem.length === 0) {
          this.firstItems.push(this.firstResponse);
        }
      }
      this.firstResponse = resp[0].payload.doc;
      this.lastResponse = this.disableGoNext ? resp[resp.length - 1].payload.doc : resp[resp.length - 2].payload.doc
      if (!this.disableGoNext) {
        resp.pop();
      }
      this.mappingResponse(resp);
      // if (unsubscribe) {
      //   subscriber.unsubscribe();
      // }
    });
  }

}
