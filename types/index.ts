export type Priority = 'high' | 'medium' | 'low';
export type RecurringType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  completed: boolean;
  delayed: boolean;
  category?: 'work' | 'personal' | 'health' | 'other';
  priority?: Priority;
  tags?: string[];
  notes?: string;
  recurring?: RecurringType;
  recurringEndDate?: string;
  parentTaskId?: string;
  createdAt?: string;
  completedAt?: string;
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
