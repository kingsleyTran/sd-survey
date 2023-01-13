import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(
      public router: Router,
      public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  startSurvey() {
    const id = this.activatedRoute.snapshot?.params.id || null;
    this.router.navigate([`../../start/${id}`], {relativeTo: this.activatedRoute})
  }

}
