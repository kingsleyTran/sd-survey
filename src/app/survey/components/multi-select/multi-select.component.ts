import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {

  @Input()
  questionData: any;

  @Input()
  idx: number;

  @Output()
  onChangeCheckBox: EventEmitter<any[]> = new EventEmitter<any[]>();

  formGroup: FormGroup;

  constructor() { }

  ngOnInit(): void {
    if (this.questionData.isRequired) {
      this.formGroup = new FormGroup({
        'formValue': new FormArray([], [Validators.required]),
      });
    } else {
      this.formGroup = new FormGroup({
        'formValue': new FormArray([], []),
      });
    }
  }

  options() {
    return this.questionData.options.split(';').map((o: string) => { return o.trim() });
  }

  onChangeSelect(e: any) {
    const checkboxes: FormArray = this.formGroup.get('formValue') as FormArray;

    if (e.target.checked) {
      checkboxes.push(new FormControl(e.target.value));
    } else {
      const index = checkboxes.controls.findIndex(x => x.value === e.target.value);
      checkboxes.removeAt(index);
    }
    this.onChangeCheckBox.emit(this.formGroup.value['formValue']);

  }

}
