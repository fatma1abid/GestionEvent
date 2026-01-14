import { Component } from '@angular/core';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  email: string = '';
  firstName: string = '';
  lastName: string = '';
  phone: string = '';
  password: string = '';
  imageUrl: string = '';

  // Messages d'erreur séparés
  firstNameError: string = '';
  lastNameError: string = '';
  phoneError: string = '';
  emailError: string = '';
  passwordError: string = '';
  imageUrlError: string = '';
  successMessage: string = '';

  private emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private phonePattern = /^(?:\+216|0)[0-9]{8}$/;
  private urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i;

  register() {
    // Réinitialiser tous les messages d'erreur
    this.firstNameError = '';
    this.lastNameError = '';
    this.phoneError = '';
    this.emailError = '';
    this.passwordError = '';
    this.imageUrlError = '';
    this.successMessage = '';

    // ✅ Validation champs obligatoires
    if (!this.firstName.trim()) this.firstNameError = 'Veuillez entrer votre prénom';
    if (!this.lastName.trim()) this.lastNameError = 'Veuillez entrer votre nom';
    if (!this.phone.trim()) this.phoneError = 'Veuillez entrer votre numéro de téléphone';
    if (!this.email.trim()) this.emailError = 'Veuillez entrer votre email';
    if (!this.password.trim()) this.passwordError = 'Veuillez entrer un mot de passe';

    // Stop si un champ obligatoire est vide
    if (this.firstNameError || this.lastNameError || this.phoneError || this.emailError || this.passwordError) return;

    // ✅ Validation email
    if (!this.emailPattern.test(this.email.trim())) {
      this.emailError = 'Veuillez entrer un email valide';
      return;
    }

    // ✅ Validation numéro tunisien
    if (!this.phonePattern.test(this.phone.trim())) {
      this.phoneError = 'Numéro tunisien invalide (ex: +216XXXXXXXX ou 0XXXXXXXX)';
      return;
    }

    // ✅ Validation URL image optionnelle
    if (this.imageUrl && !this.urlPattern.test(this.imageUrl.trim())) {
      this.imageUrlError = 'URL d’image invalide (png, jpg, jpeg, gif, svg)';
      return;
    }

    // ✅ Vérifier doublon email
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email.trim() === this.email.trim())) {
      this.emailError = 'Cet email est déjà utilisé';
      return;
    }

    // ✅ Création utilisateur
    const newUser: User = {
      email: this.email.trim(),
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      phone: this.phone.trim(),
      password: this.password,
      imageUrl: this.imageUrl.trim() || 'assets/images/default-avatar.png'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    this.successMessage = 'Compte créé avec succès ! Vous pouvez vous connecter.';

    // Réinitialiser formulaire
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.phone = '';
    this.password = '';
    this.imageUrl = '';
  }
}
