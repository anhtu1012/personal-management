export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  completed: boolean;
  delayed: boolean;
  category?: 'work' | 'personal' | 'health' | 'other';
}

export interface Schedule {
  id: string;
  date: string;
  tasks: Task[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  timezone: string;
}
