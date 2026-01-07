import { createReducer, on } from '@ngrx/store';
// `createReducer` : permet de créer un reducer NgRx facilement
// `on` : lie une action à une fonction qui modifie l'état

import { initialState } from './task.state';
// importe l'état initial défini dans task.state.ts

import * as TaskActions from './task.actions';
// importe toutes les actions définies dans task.actions.ts

// Définition du reducer pour les tâches
export const taskReducer = createReducer(
  initialState, // état initial avant toute action

  // Ajouter une tâche
  on(TaskActions.addTask, (state, { task }) => ({
    ...state,               // on copie l'état existant pour respecter l'immuabilité
    tasks: [...state.tasks, task] // on ajoute la nouvelle tâche à la liste
  })),

  // Mettre à jour une tâche existante
  on(TaskActions.updateTask, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t =>
      t.id === task.id ? task : t // on remplace la tâche correspondant à l'id par la nouvelle
    )
  })),

  // Supprimer une tâche
  on(TaskActions.deleteTask, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== id) // on garde toutes les tâches sauf celle à supprimer
  })),

  // Terminer ou annuler une tâche
  on(TaskActions.toggleTask, (state, { id }) => ({
    ...state,
    tasks: state.tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t // on inverse le champ `completed` de la tâche ciblée
    )
  })),

  // Supprimer toutes les tâches (utile à la déconnexion)
  on(TaskActions.clearTasks, state => ({
    ...state,
    tasks: [] // on vide simplement la liste des tâches
  }))
);
