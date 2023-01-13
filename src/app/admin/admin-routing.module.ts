import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent} from "./components/log-in/log-in.component";
import { ContainerComponent } from './components/container/container.component';
import { AdminGuard } from "@shared/guards/admin.guard";
import {QuestionFormComponent} from "./components/question-form/question-form.component";
import {QuestionListComponent} from "./components/question-list/question-list.component";
import {ResponseListComponent} from "./components/response-list/response-list.component";
import {ResponseDetailComponent} from "./components/response-detail/response-detail.component";

const routes: Routes = [
  { path: '', redirectTo: 'dashboard/questions', pathMatch: 'full'},
  { path: 'log-in', component: LogInComponent },
  { path: 'dashboard', redirectTo: 'dashboard/questions', pathMatch: 'full'},
  { path: 'dashboard', component: ContainerComponent, children: [
      { path: 'questions/:id', component: QuestionFormComponent, canActivate: [AdminGuard] },
      { path: 'questions', component: QuestionListComponent, canActivate: [AdminGuard] },
      { path: 'responses/:id', component: ResponseDetailComponent, canActivate: [AdminGuard] },
      { path: 'responses', component: ResponseListComponent, canActivate: [AdminGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
