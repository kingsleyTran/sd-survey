import { Component } from '@angular/core';
import {BaseFormComponent} from "@shared/components/base-form/base-form.component";
import {Question} from "../question-list/question-list.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {ActivatedRoute, Router} from "@angular/router";
import {LoaderService} from "@shared/services/loader.service";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss']
})
export class QuestionFormComponent extends BaseFormComponent {

  formData: Question | null;
  formGroup: FormGroup;
  collectionName: string = "questions";

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

  initForm(): void {
    this.formGroup = new FormGroup({
      'question': new FormControl('', [Validators.required]),
      'type': new FormControl('Text', [Validators.required]),
      'isRequired': new FormControl(true, [Validators.required]),
      'options': new FormControl(''),
      'order': new FormControl(0, [Validators.required]),
    })
  }
}
