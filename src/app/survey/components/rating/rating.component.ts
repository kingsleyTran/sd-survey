import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  @Input()
  questionData: any;

  @Input()
  idx: number;

  @Output()
  onRating: EventEmitter<any> = new EventEmitter<any>();

  hoverIdx: number;

  clickIdx: number;

  arrayStar = [1, 2, 3 , 4, 5]

  constructor() { }

  ngOnInit(): void {
  }

  onHover(idx: number): void{
    this.hoverIdx = idx;
  }

  onClick(idx: number): void {
    this.clickIdx = idx;
    this.onRating.emit(idx);
  }

}
