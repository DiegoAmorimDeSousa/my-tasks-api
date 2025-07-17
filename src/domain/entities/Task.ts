export interface Task {
  // id?: string; // REMOVIDO: O ID será gerenciado pelo Mongoose (_id) e mapeado para 'id' via getters.
  title: string;
  description?: string;
  category: string;
  dueDate?: Date;
  status: 'pending' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}