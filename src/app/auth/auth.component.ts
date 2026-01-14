import { Component, Output, EventEmitter } from '@angular/core';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  phone: string = '';
  password: string = '';
  imageUrl: string = '';
  emailError: string = '';

  isSignup: boolean = false;

  @Output() loginEvent = new EventEmitter<boolean>();

  private emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  toggleMode() {
    console.log('Mode changé, isSignup =', !this.isSignup);
    this.isSignup = !this.isSignup;
    this.clearFields();
  }

  private clearFields() {
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.phone = '';
    this.password = '';
    this.imageUrl = '';
    this.emailError = '';
  }

 private getUsers(): User[] {
  const data = localStorage.getItem('users');
  console.log('getUsers():', data);
  return JSON.parse(data || '[]');
}


  private saveUsers(users: User[]) {
    localStorage.setItem('users', JSON.stringify(users));
    console.log('saveUsers():', users);
  }

  signup() {
    this.emailError = '';
    if (!this.validateSignup()) return;

    const users = this.getUsers();

    const exists = users.some(u => u.email.trim() === this.email.trim());
    console.log('Vérification email existant:', exists);
    if (exists) {
      this.emailError = 'Cet email existe déjà';
      return;
    }

    const newUser: User = {
      email: this.email.trim(),
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      phone: this.phone.trim(),
      password: this.password,
      imageUrl: this.imageUrl || 'assets/images/default-avatar.png'
    };

    users.push(newUser);
    this.saveUsers(users);
    console.log('Nouvel utilisateur créé:', newUser);

    this.setLoggedUser(newUser);
    this.loginEvent.emit(true);
  }

  login() {
    this.emailError = '';
    if (!this.validateEmail()) return;

    const users = this.getUsers();
    console.log('Users récupérés du localStorage pour login:', users);

    const user = users.find(u => u.email.trim() === this.email.trim() && u.password === this.password);
    console.log('Utilisateur trouvé:', user);

    if (!user) {
      this.emailError = 'Email ou mot de passe incorrect';
      return;
    }

    this.setLoggedUser(user);
    this.loginEvent.emit(true);
  }

  private setLoggedUser(user: User) {
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userFirstName', user.firstName);
    localStorage.setItem('userLastName', user.lastName);
    localStorage.setItem('userPhone', user.phone);
    localStorage.setItem('userImage', user.imageUrl || 'assets/images/default-avatar.png');
    console.log('Stockage utilisateur connecté dans localStorage:', user);
  }

  logout() {
    console.log('Déconnexion utilisateur');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userImage');
    this.loginEvent.emit(false);
    
  }

  private validateEmail(): boolean {
    if (!this.email.trim()) {
      this.emailError = 'Veuillez entrer votre email';
      return false;
    }
    if (!this.emailPattern.test(this.email.trim())) {
      this.emailError = 'Veuillez entrer un email valide';
      return false;
    }
    if (!this.password) {
      this.emailError = 'Veuillez entrer votre mot de passe';
      return false;
    }
    return true;
  }

  private validateSignup(): boolean {
    if (!this.email || !this.firstName || !this.lastName || !this.phone || !this.password) {
      this.emailError = 'Veuillez remplir tous les champs';
      return false;
    }
    if (!this.emailPattern.test(this.email.trim())) {
      this.emailError = 'Veuillez entrer un email valide';
      return false;
    }
    return true;
  }

  isLogged(): boolean {
    return !!localStorage.getItem('userEmail');
  }

  getUserEmail(): string {
    return localStorage.getItem('userEmail') || '';
  }

  getUserFullName(): string {
    return `${localStorage.getItem('userFirstName') || ''} ${localStorage.getItem('userLastName') || ''}`;
  }

  getUserPhone(): string {
    return localStorage.getItem('userPhone') || '';
  }

  getUserImage(): string {
    return localStorage.getItem('userImage') || 'assets/images/default-avatar.png';
  }
}
