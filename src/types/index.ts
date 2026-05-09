export type ExpenseCategory =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Bills"
  | "Health"
  | "Entertainment"
  | "Others";

export interface User {
  id: string;
  telegramId: string;
  name: string;
  username?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  note: string;
  date: string;
  createdAt: string;
  userId: string;
}

export interface CategorySummary {
  category: ExpenseCategory;
  total: number;
  count: number;
}

export interface ExpenseSummary {
  totalAmount: number;
  count: number;
  byCategory: CategorySummary[];
  startDate: string;
  endDate: string;
}

export interface BudgetStatus {
  budget: {
    id: string;
    monthlyLimit: number;
    alertPercent: number;
  };
  spent: number;
  remaining: number;
  percentUsed: number;
  isExceeded: boolean;
  isNearLimit: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
