import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sd-survey';
  constructor(
    translateService: TranslateService
  ) {
    translateService.addLangs(['en', 'no']);
    translateService.setDefaultLang('en');
    translateService.use('en');
  }
}
