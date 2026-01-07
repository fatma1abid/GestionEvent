import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { deleteTask, toggleTask } from '../tasks/store/task.actions';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  // Observable contenant la liste des tâches à afficher pour l'utilisateur connecté
  tasks$!: Observable<Task[]>;

  // Événement pour envoyer une tâche au formulaire afin de la modifier
  @Output() editTaskEvent = new EventEmitter<Task>();

  constructor(private store: Store<{ tasks: { tasks: Task[] } }>) {}

  ngOnInit(): void {
    // Sélection des tâches dans le store et filtrage pour l'utilisateur connecté
    this.tasks$ = this.store.select(state =>
      state.tasks.tasks.filter(
        t => t.userEmail === window.localStorage.getItem('userEmail')
      )
    );
  }

  // Méthode pour basculer l'état complété/non complété d'une tâche
  toggle(task: Task) {
    this.store.dispatch(toggleTask({ id: task.id }));
    // Dispatch d'une action vers le store → le reducer mettra à jour l'état
  }

  // Méthode pour supprimer une tâche
  delete(task: Task) {
    this.store.dispatch(deleteTask({ id: task.id }));
  }

  // Méthode pour éditer une tâche
  edit(task: Task) {
    this.editTaskEvent.emit(task);
  }
}
