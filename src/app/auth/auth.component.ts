import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  email: string = '';
  emailError: string = '';
  // Permet de notifier le composant parent (AppComponent) que l'utilisateur est connecté
  @Output() loginEvent = new EventEmitter<boolean>();

  private emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  login() {
    this.emailError = ''; // Réinitialise le message d'erreur

    if (!this.email) {
      this.emailError = 'Veuillez entrer votre email';
      return;
    }

    if (!this.emailPattern.test(this.email)) {
      this.emailError = 'Veuillez entrer un email valide';
      return;
    }

    // Si email valide → stocke dans le localStorage et notifie AppComponent
    localStorage.setItem('userEmail', this.email);
    this.loginEvent.emit(true);
  }

  logout() {
    localStorage.removeItem('userEmail');
    this.loginEvent.emit(false);
  }

  isLogged(): boolean {
    return !!localStorage.getItem('userEmail');
  }

  getUserEmail(): string {
    return localStorage.getItem('userEmail') || '';
  }
}
