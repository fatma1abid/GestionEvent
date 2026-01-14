import { Component } from '@angular/core';
import { Task } from './models/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Auth & profil
  isLogged: boolean = !!localStorage.getItem('userEmail');
  isProfileView: boolean = false;   // Vue profil
  showMyEvents: boolean = false;    // Vue mes événements

  // Édition de tâche
  taskToEdit: Task | null = null;

  // Infos utilisateur
  userEmail: string = localStorage.getItem('userEmail') || '';
  userFirstName: string = localStorage.getItem('userFirstName') || '';
  userLastName: string = localStorage.getItem('userLastName') || '';
  userPhone: string = localStorage.getItem('userPhone') || '';

  constructor(private router: Router) {}

  // 🔹 Connexion / déconnexion
  setLogged(status: boolean) {
  this.isLogged = status;

  if (status) {
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.userFirstName = localStorage.getItem('userFirstName') || '';
    this.userLastName = localStorage.getItem('userLastName') || '';
    this.userPhone = localStorage.getItem('userPhone') || '';
  } else {
    this.logout(); // supprime juste les infos de session
  }
}


logout() {

  console.log('Déconnexion utilisateur');
  console.log('Avant suppression, users dans localStorage:', localStorage.getItem('users'));

  // Supprimer uniquement les infos de session
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userFirstName');
  localStorage.removeItem('userLastName');
  localStorage.removeItem('userPhone');
  localStorage.removeItem('userImage');

  console.log('Après suppression, users dans localStorage:', localStorage.getItem('users'));

  this.isLogged = false;
  this.isProfileView = false;
  this.showMyEvents = false;
  this.clearUserInfo();
  this.taskToEdit = null;
}



  clearUserInfo() {
    this.userEmail = '';
    this.userFirstName = '';
    this.userLastName = '';
    this.userPhone = '';
  }

  // 🔹 Affichage des sections
  viewMyEvents() {
    this.showMyEvents = true;
    this.isProfileView = false;
    console.log("Afficher les événements de", this.userEmail);
  }

  goToProfile() {
       this.router.navigate(['/profile']);

  }

  backToTasks() {
    this.isProfileView = false;
    this.showMyEvents = false;
  }



  // 🔹 Édition de tâche
  onEditTask(task: Task) {
    this.taskToEdit = task;
  }

  getUserEmail() {
    return this.userEmail;
  }
}
