import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ActivatedRoute, Router} from "@angular/router";
import {LoaderService} from "@shared/services/loader.service";
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-survey-form',
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.scss']
})
export class SurveyFormComponent implements OnInit {

  questions: any[];

  response: any = {};

  requiredFields: any[] = [];

  ratingPoints = 0;

  validId = false;

  name: string = "";
  email: string = "";
  phone: string = "";

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
    const id = this.activatedRoute.snapshot?.params.id;
    this.location = this.locationHash[id];
    this.validId = Object.keys(this.reviewHash).includes(id);
    if (!this.validId) {
      return;
    }
    this.loaderService.show();
    this.afs.collection('questions', ref => {
      return ref.orderBy('order', 'asc')
    }).snapshotChanges().subscribe((resp: any) => {
      this.loaderService.hide();
      this.questions = resp.map((a: any) => {
        return {
          id: a.payload.doc.id,
          ...a.payload.doc.data()
        };
      });
      this.requiredFields = this.questions.filter((question) => {
        return question.isRequired;
      }).map((q) => {
        return q.id;
      })
    })
  }

  onRating(e: any, questionData: any) {
    this.ratingPoints = e;
    this.onReceiveResponse(e, questionData);
  }

  onReceiveContactInfo(e: any, questionData: any) {
    const { name, email, phone } = e;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.onReceiveResponse(e, questionData);
  }

  onReceiveResponse(e: any, questionData: any) {
    this.response[questionData.id] = {
      question: questionData.question,
      response: e,
      order: questionData.order
    };
  }

  enableSubmitBtn() {
    const keys = Object.keys(this.response);
    return this.requiredFields.every((val) =>{
      return keys.indexOf(val) >= 0;
    })
  }

  onSubmit() {
    //  Redirect to google
    const id = this.activatedRoute.snapshot?.params.id || null;
    if (this.enableSubmitBtn()) {
      this.loaderService.show();
      this.afs.collection('responses').add({
        response: this.response,
        googleReview: false,
        name: this.name,
        email: this.email,
        phone: this.phone,
        store: this.activatedRoute.snapshot?.params.id || null,
        createdAt: Date.now()
      }).then(
          (resp) => {
            console.log(resp);
            this.loaderService.hide();
            this.toastrService.success('Your response has been saved successfully');
            if (this.ratingPoints >= 4) {
              const url = this.reviewHash[id];
              Swal.fire({
                title: 'Love us?',
                text: "Review us on Google.",
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sure'
              }).then(async (result) => {
                if (result.isConfirmed) {
                  await this.afs.collection('responses').doc(resp.id).update({
                    googleReview: true
                  });
                  setTimeout(() => {
                    window.location.assign(url);
                  }, 0);
                  setTimeout(() => {
                    this.router.navigate(['/survey/thank-you']);
                  }, 5000);
                }
              });
            } else {
              this.router.navigate([`/survey/feedback/${id}/${resp.id}` ]);
            }
          }
      ).catch((e) => {
        this.loaderService.hide();
        this.toastrService.error('Opps, something went wrong :(');
        console.error(e);
      })
    }
  }

}
