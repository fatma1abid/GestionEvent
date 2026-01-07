import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { taskReducer } from './tasks/store/task.reducer';
import { AuthComponent } from './auth/auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    TaskFormComponent,
    TaskListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        RouterModule,
        ReactiveFormsModule,
    StoreModule.forRoot({ tasks: taskReducer }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
