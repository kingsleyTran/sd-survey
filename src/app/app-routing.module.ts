import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'survey', pathMatch: 'full' },
  {
    path: 'survey',
    loadChildren:  () => import('./survey/survey.module').then(module => {
      // window?.document?.getElementById('theme')?.setAttribute('href', '/assets/styles/student_style.css');
      return module.SurveyModule;
    })
  },
  {
    path: 'admin',
    loadChildren:  () => import('./admin/admin.module').then(module => {
      // window?.document?.getElementById('theme')?.setAttribute('href', '/assets/styles/student_style.css');
      return module.AdminModule;
    })
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
