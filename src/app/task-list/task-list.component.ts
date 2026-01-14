import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { deleteTask, toggleTask } from '../tasks/store/task.actions';
import { Task } from '../models/task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks$!: Observable<Task[]>;  // Liste complète du store
  allTasks: Task[] = [];        // Stocke toutes les tâches après subscription
  filteredTasks: Task[] = [];   // Tâches filtrées à afficher

  searchTerm: string = '';      // Recherche par titre
  startDate: string = '';       // Filtre début
  endDate: string = '';         // Filtre fin

  @Output() editTaskEvent = new EventEmitter<Task>();

constructor(
  private fb: FormBuilder,
  private store: Store<{ tasks: { tasks: Task[] } }>,
  private router: Router,
  private route: ActivatedRoute
) { }

  ngOnInit(): void {
    // Sélection du store et filtre par utilisateur
    this.tasks$ = this.store.select(state =>
      state.tasks.tasks.filter(
        t => t.userEmail === window.localStorage.getItem('userEmail')
      )
    );

    // Subscription pour mettre à jour les listes locales
    this.tasks$.subscribe(tasks => {
      console.log('Toutes les tâches du store:', tasks);
      this.allTasks = tasks;
      this.applyFilters();
    });
  }

  // Appliquer les filtres (recherche et date)
  applyFilters() {
    this.filteredTasks = this.allTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(this.searchTerm.toLowerCase());

      let matchesDate = true;
      if (this.startDate) {
        matchesDate = new Date(task.dueDate) >= new Date(this.startDate);
      }
      if (this.endDate) {
        matchesDate = matchesDate && new Date(task.dueDate) <= new Date(this.endDate);
      }

      return matchesSearch && matchesDate;
    });

    console.log('Tâches filtrées:', this.filteredTasks);
  }

  toggle(task: Task) {
    console.log('Toggle task:', task);
    this.store.dispatch(toggleTask({ id: task.id }));
  }

  delete(task: Task) {
    console.log('Delete task:', task);
    this.store.dispatch(deleteTask({ id: task.id }));
  }

editTask(id: number) {
  this.router.navigate(['/edit_task', id]);
}

}
