// Type definitions untuk Expense Tracker

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: Date;
  category: string; // String untuk SQLite compatibility
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Category constants untuk expense
export const EXPENSE_CATEGORIES = {
  FOOD: 'FOOD',
  TRANSPORTATION: 'TRANSPORTATION', 
  ENTERTAINMENT: 'ENTERTAINMENT',
  BILLS: 'BILLS',
  OTHERS: 'OTHERS'
} as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[keyof typeof EXPENSE_CATEGORIES];

export interface ExpenseFormData {
  title: string;
  amount: string;
  date: string;
  category: ExpenseCategory;
  description?: string;
}

export interface MonthlyExpense {
  total: number;
  count: number;
  byCategory: Record<string, number>;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

// Extended Session type untuk NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
