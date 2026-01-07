import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { addTask, updateTask } from '../tasks/store/task.actions';

import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnChanges {

  form: FormGroup; 
  editingTask: Task | null = null; // Stocke la tâche en cours d'édition

  @Input() taskToEdit: Task | null = null;
  // Input depuis le composant parent (TaskList)
  // Quand on clique sur "Modifier" dans la liste, la tâche est envoyée ici

  constructor(
    private fb: FormBuilder,
    private store: Store<{ tasks: { tasks: Task[] } }> // typage du Store
  ) {
    // Initialisation du formulaire avec FormBuilder
    this.form = this.fb.group({
      title: ['', Validators.required], // titre obligatoire
      description: ['', Validators.required], // description obligatoire
      priority: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      // priorité entre 1 et 5
      dueDate: ['', Validators.required] // date obligatoire
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // Cette méthode est appelée quand un Input change
    if (changes['taskToEdit'] && this.taskToEdit) {
      // Si une tâche est envoyée depuis le parent pour édition
      // On remplit le formulaire avec ses données
      this.form.patchValue({
        title: this.taskToEdit.title,
        description: this.taskToEdit.description,
        priority: this.taskToEdit.priority,
        dueDate: this.taskToEdit.dueDate
      });
      this.editingTask = this.taskToEdit;
      // On garde la référence pour savoir qu'on est en édition
    }
  }

  submit() {
    // Méthode appelée lors de l'envoi du formulaire
    if (this.form.invalid) {
      // Si le formulaire est invalide, on marque tous les champs touchés pour afficher les erreurs
      this.form.markAllAsTouched();
      return; // on arrête ici
    }

    // Création de l'objet Task à partir du formulaire
    const taskData: Task = {
      ...this.form.value, // titre, description, priorité, dueDate
      id: this.editingTask ? this.editingTask.id : new Date().getTime(),
      // On garde l'ID si édition, sinon on crée un nouvel ID unique
      completed: this.editingTask ? this.editingTask.completed : false,
      // On garde l'état completed si édition, sinon false
      userEmail: localStorage.getItem('userEmail')!
      // On associe la tâche à l'utilisateur connecté
    };

    if (this.editingTask) {
      // Si on est en édition, on dispatch l'action updateTask
      this.store.dispatch(updateTask({ task: taskData }));
    } else {
      // Sinon, on dispatch l'action addTask
      this.store.dispatch(addTask({ task: taskData }));
    }

    // Réinitialisation du formulaire après soumission
    this.form.reset({ priority: 1 });
    // On remet la priorité à 1 par défaut
    this.editingTask = null; // Plus de tâche en édition
  }

  // Méthode utilitaire pour le template
  // Permet d'afficher un message d'erreur si un champ est invalide
  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field); // récupère le FormControl
    return !!control && control.invalid && (control.dirty || control.touched);
    // vrai si invalide et que l'utilisateur a interagi avec le champ
  }
}
