export interface Task {
  id: number;
  title: string;
  description: string;
  priority: number;
  dueDate: string;
  completed: boolean;
  userEmail: string;

  // Nouveaux attributs
  location?: string;        // Lieu de l’événement
  imageUrl?: string;        // URL d’une image associée
  category?: string;        // Catégorie
  maxParticipants?: number; // Nombre maximum de participants
  notes?: string;           // Notes supplémentaires
}
