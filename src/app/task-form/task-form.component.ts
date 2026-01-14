import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { addTask, updateTask } from '../tasks/store/task.actions';
import { Task } from '../models/task.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {

  form: FormGroup;
  editingTask: Task | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ tasks: { tasks: Task[] } }>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
      priority: [1, [Validators.required, Validators.min(1)]],
      dueDate: ['', Validators.required],
      location: ['', Validators.maxLength(100)],
      category: ['', Validators.maxLength(50)],
      maxParticipants: [0, [Validators.min(0)]],
      notes: ['', Validators.maxLength(300)],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    const taskId = this.route.snapshot.params['id']; // récupère id depuis l'URL
    if (taskId) {
      // récupère la tâche depuis le store
      this.store.select('tasks').pipe(take(1)).subscribe(state => {
        const task = state.tasks.find(t => t.id === +taskId);
        if (task) {
          this.editingTask = task;
          this.form.patchValue(task);
        }
      });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const taskData: Task = {
      ...this.form.value,
      id: this.editingTask ? this.editingTask.id : new Date().getTime(),
      completed: this.editingTask ? this.editingTask.completed : false,
      userEmail: localStorage.getItem('userEmail')!
    };

    if (this.editingTask) {
      this.store.dispatch(updateTask({ task: taskData }));
    } else {
      this.store.dispatch(addTask({ task: taskData }));
    }

    this.form.reset({ priority: 1 });
    this.editingTask = null;
    this.router.navigate(['/tasks']);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.form.patchValue({ imageUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}
