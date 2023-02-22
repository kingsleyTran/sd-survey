import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {LoaderService} from "@shared/services/loader.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  feedback: string = "";
  validId = false;

  locationHash: any = {
    'penrith': 'Penrith',
    'ns': 'North Strathfield'
  }
  location: string;

  reviewHash: any = {
    'penrith': 'https://search.google.com/local/writereview?placeid=ChIJeQUnJOCFEmsRVXjRQMjuVPw',
    'ns': 'https://search.google.com/local/writereview?placeid=ChIJ0RN60y6lEmsRpfoLXuACES0',
    'campbelltown': 'https://www.google.com/maps/place/The+Savoury+Dining+Campbelltown/@-34.0671114,150.8119705,17z/data=!3m2!4b1!5s0x6b12ee5621e7b05f:0x7db4ed46aa41ba88!4m5!3m4!1s0x6b12ef266ba94ecd:0x21267602e0798933!8m2!3d-34.0671114!4d150.8141592'
  }

  constructor(
      protected afs: AngularFirestore,
      protected activatedRoute: ActivatedRoute,
      protected router: Router,
      public toastrService: ToastrService,
      public loaderService: LoaderService,
      public translateService: TranslateService
  ) { }

  ngOnInit(): void {
    const location = this.activatedRoute.snapshot?.params.location
    this.location = this.locationHash[location];
    this.validId = Object.keys(this.reviewHash).includes(location);
    if (!this.validId) {
      return;
    }
  }

  onSubmit() {
    this.loaderService.show();
    const id = this.activatedRoute.snapshot?.params.id || null;
    this.afs.collection('responses').doc(id).update({
      feedback: this.feedback
    }).then(() => {
      this.loaderService.hide();
      this.router.navigate(['/survey/thank-you']);
    }).catch((e) => {
      this.loaderService.hide();
      this.toastrService.error('Opps, something went wrong :(');
      console.error(e);
    })
  }

}
