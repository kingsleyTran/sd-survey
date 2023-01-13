import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandbyComponent } from './components/standby/standby.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { DragDropDirective } from './directives/drag-drop.directive';
import {AngularFireStorageModule, BUCKET } from '@angular/fire/compat/storage';
import { BaseListComponent } from './components/base-list/base-list.component';
import { BaseFormComponent } from './components/base-form/base-form.component';
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  providers: [
    { provide: BUCKET, useValue: 'savourydining.appspot.com' }
  ],
  declarations: [
    StandbyComponent,
    ImageUploaderComponent,
    DragDropDirective,
    BaseListComponent,
    BaseFormComponent
  ],
  imports: [
    CommonModule,
    AngularFireStorageModule,
    TranslateModule
  ],
  exports: [
    StandbyComponent,
    ImageUploaderComponent
  ]
})
export class SharedModule { }
