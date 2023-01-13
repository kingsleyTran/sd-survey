import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {WelcomeComponent} from "./components/welcome/welcome.component";
import {ThankYouComponent} from "./components/thank-you/thank-you.component";
import {SurveyFormComponent} from "./components/survey-form/survey-form.component";
import {FeedbackComponent} from "./components/feedback/feedback.component";

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full'},
  { path: '', component: HomeComponent, children: [
      { path: 'thank-you', component: ThankYouComponent},
      { path: 'welcome/:id', component: WelcomeComponent },
      { path: 'start/:id', component: SurveyFormComponent },
      { path: 'feedback/:location/:id', component: FeedbackComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule { }
