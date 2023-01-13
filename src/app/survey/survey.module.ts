import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from '@shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from "@ngx-translate/core";
import {NgbAlertModule, NgbModule, NgbPaginationModule, NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";
import {SurveyRoutingModule} from "./survey-routing.module";
import { HomeComponent } from './components/home/home.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { SurveyFormComponent } from './components/survey-form/survey-form.component';
import { MultiSelectComponent } from './components/multi-select/multi-select.component';
import { RatingComponent } from './components/rating/rating.component';
import { LongTextComponent } from './components/long-text/long-text.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { TextComponent } from './components/text/text.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { FeedbackComponent } from './components/feedback/feedback.component';


@NgModule({
  declarations: [
    HomeComponent,
    WelcomeComponent,
    SurveyFormComponent,
    MultiSelectComponent,
    RatingComponent,
    LongTextComponent,
    ContactFormComponent,
    TextComponent,
    ThankYouComponent,
    FeedbackComponent
  ],
  imports: [
    CommonModule,
    SurveyRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    NgbModule,
    NgbPaginationModule,
    NgbAlertModule,
    NgbTypeaheadModule
  ]
})
export class SurveyModule { }
