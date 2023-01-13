import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  @Input()
  questionData: any;

  @Input()
  idx: number;

  @Output()
  onChangeFormEmitter: EventEmitter<any> = new EventEmitter<any>();

  formGroup: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      'name': new FormControl("", [Validators.required]),
      'email': new FormControl("", [Validators.required, Validators.email]),
      'phone': new FormControl("", [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    })
  }

  onChangeForm() {
    if (this.formGroup.valid) {
      this.onChangeFormEmitter.emit(this.formGroup.value);
    }
  }

}
