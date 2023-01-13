import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from '@shared/services/loader.service';

@Component({
  selector: 'app-standby',
  templateUrl: './standby.component.html',
  styleUrls: ['./standby.component.scss']
})
export class StandbyComponent {

  value = 50;
  isLoading: Subject<boolean> = this.loaderService.isLoading;

  constructor(
    private loaderService: LoaderService
  ) {
    // this.color = window.location.pathname.startsWith('/universities') ? 'warn' : 'primary';
  }
}
