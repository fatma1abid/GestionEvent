import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  @Output() loginEvent = new EventEmitter<boolean>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      // Si pas connecté, redirige vers auth
      this.router.navigate(['/auth']);
      return;
    }

    // Récupère les infos depuis "users" ou localStorage
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    this.user = users.find(u => u.email === email) || {
      firstName: localStorage.getItem('userFirstName') || '',
      lastName: localStorage.getItem('userLastName') || '',
      email: email,
      phone: localStorage.getItem('userPhone') || ''
    };
  }

  backToTasks() {
    this.router.navigate(['/tasks']); // ou page principale
  }

 
}
