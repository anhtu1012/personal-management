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

// Money Management Types
export interface Member {
  id: string;
  name: string;
  avatar?: string;
  color: string; // Màu đại diện cho member
  createdAt: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // Member ID người trả tiền
  splitBetween: string[]; // Array of Member IDs chia tiền
  date: string;
  category?: 'food' | 'transport' | 'entertainment' | 'shopping' | 'other';
  settled: boolean; // Đã thanh toán chưa
  createdAt: string;
}

export interface Balance {
  memberId: string;
  totalPaid: number; // Tổng tiền đã trả
  totalOwed: number; // Tổng tiền nợ
  balance: number; // Số dư (paid - owed)
}

export interface Settlement {
  from: string; // Member ID
  to: string; // Member ID
  amount: number;
}

export interface Payment {
  id: string;
  memberId: string; // Người thanh toán
  amount: number; // Số tiền đã trả
  date: string;
  note?: string;
  createdAt: string;
}

// Personal Expense Types
export interface PersonalExpense {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO date string
  category: 'food' | 'transport' | 'entertainment' | 'shopping' | 'bills' | 'health' | 'other';
  note?: string;
  createdAt: string;
}
