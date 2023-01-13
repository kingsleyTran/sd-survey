import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogInComponent } from './components/log-in/log-in.component';
import { ContainerComponent } from './components/container/container.component';

import {SharedModule} from '@shared/shared.module';
import {AdminRoutingModule} from "./admin-routing.module";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from "@ngx-translate/core";
import {NgbAlertModule, NgbModule, NgbPaginationModule, NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";
import { QuestionFormComponent } from './components/question-form/question-form.component';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { ResponseListComponent } from './components/response-list/response-list.component';
import { ResponseDetailComponent } from './components/response-detail/response-detail.component';


@NgModule({
  declarations: [
    LogInComponent,
    ContainerComponent,
    QuestionFormComponent,
    QuestionListComponent,
    ResponseListComponent,
    ResponseDetailComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
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
export class AdminModule { }
