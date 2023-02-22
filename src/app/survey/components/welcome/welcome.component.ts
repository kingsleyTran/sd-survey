import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  locationHash: any = {
    'penrith': 'Penrith',
    'ns': 'North Strathfield'
  }
  location: string;

  constructor(
      public router: Router,
      public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot?.params.id;
    this.location = this.locationHash[id];
  }

  startSurvey() {
    const id = this.activatedRoute.snapshot?.params.id || null;
    this.router.navigate([`../../start/${id}`], {relativeTo: this.activatedRoute})
  }

}
