import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-long-text',
  templateUrl: './long-text.component.html',
  styleUrls: ['./long-text.component.scss']
})
export class LongTextComponent implements OnInit {

  @ViewChild('textArea', {static: true}) textAreaElement: any;

  @Input()
  questionData: any;

  @Input()
  idx: number;

  @Output()
  onFocusOut: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onFinishEditing() {
    this.onFocusOut.emit(this.textAreaElement.nativeElement.value);
  }

}
