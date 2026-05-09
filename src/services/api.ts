import axios from "axios";
import {
  ApiResponse,
  Expense,
  ExpenseSummary,
  BudgetStatus,
  User,
} from "../types";

const BASE_URL = (import.meta.env["VITE_API_URL"] as string) ?? "";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: async (telegramId: string) => {
    const res = await api.post<ApiResponse<{ token: string; user: User }>>(
      "/api/auth/login",
      { telegramId },
    );
    return res.data.data!;
  },
  getMe: async () => {
    const res = await api.get<ApiResponse<User>>("/api/auth/me");
    return res.data.data!;
  },
};

// ── Expenses ─────────────────────────────────────────────────────────────────
export const expenseApi = {
  getToday: async () => {
    const res = await api.get<
      ApiResponse<{ expenses: Expense[]; summary: ExpenseSummary }>
    >("/api/expenses/today");
    return res.data.data!;
  },
  getWeek: async () => {
    const res =
      await api.get<
        ApiResponse<{ expenses: Expense[]; summary: ExpenseSummary }>
      >("/api/expenses/week");
    return res.data.data!;
  },
  getMonth: async () => {
    const res = await api.get<
      ApiResponse<{ expenses: Expense[]; summary: ExpenseSummary }>
    >("/api/expenses/month");
    return res.data.data!;
  },
  getRecent: async (limit = 10) => {
    const res = await api.get<ApiResponse<Expense[]>>(
      `/api/expenses/recent?limit=${limit}`,
    );
    return res.data.data!;
  },
  delete: async (id: string) => {
    await api.delete(`/api/expenses/${id}`);
  },
};

// ── Budget ───────────────────────────────────────────────────────────────────
export const budgetApi = {
  getStatus: async () => {
    const res = await api.get<ApiResponse<BudgetStatus | null>>(
      "/api/budgets/status",
    );
    return res.data.data ?? null;
  },
  setBudget: async (monthlyLimit: number, alertPercent = 80) => {
    const res = await api.post<ApiResponse<BudgetStatus>>("/api/budgets", {
      monthlyLimit,
      alertPercent,
    });
    return res.data.data!;
  },
};
