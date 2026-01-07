import { Component } from '@angular/core';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLogged = !!localStorage.getItem('userEmail');
  taskToEdit: Task | null = null; // tâche en cours d'édition

  setLogged(status: boolean) {
    this.isLogged = status;
  }

  logout() {
    localStorage.removeItem('userEmail');
    this.isLogged = false;
    this.taskToEdit = null; // réinitialise l'édition à la déconnexion
  }

  getUserEmail() {
    return localStorage.getItem('userEmail') || '';
  }

  // Réception de la tâche à éditer depuis TaskListComponent
  onEditTask(task: Task) {
    this.taskToEdit = task;
  }
}
