# 💸 Expense Tracker — Frontend Dashboard

> A clean React dashboard for the Expense Tracker Telegram Bot. View your spending by category, track your budget, and manage expenses — all synced with the bot in real time.

---

## 🔗 Links

| Resource          | URL                                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| 🎨 Live Dashboard | [expense-tracker-frontend.vercel.app](https://expense-tracker-telegram-bot-fronte.vercel.app/login)                 |
| 🤖 Telegram Bot   | [@ExpenseTrack_R_Bot](https://t.me/ExpenseTrack_R_Bot)                                                   |
| ⚙️ Backend Repo   | [github.com/yourname/expense-tracker-backend](https://github.com/rifah07/expense-tracker-telegram-bot-backend) |

---

## ✨ Features

- 🔐 **Login** with your Telegram ID — no password needed
- 📊 **Dashboard** — today's spending, monthly total, top category, budget status
- 🍩 **Doughnut chart** — category breakdown with amounts
- 💰 **Budget tracker** — progress bar with color alerts (green/yellow/red)
- 💸 **Expenses page** — filter by today/week/month, delete expenses
- 📱 **Responsive** — works on mobile and desktop

---

## 🛠️ Tech Stack

| Layer      | Technology                 |
| ---------- | -------------------------- |
| Language   | TypeScript                 |
| Framework  | React 18                   |
| Build tool | Vite                       |
| Styling    | Tailwind CSS               |
| Charts     | Chart.js + react-chartjs-2 |
| HTTP       | Axios                      |
| State      | Zustand                    |
| Routing    | React Router v6            |
| Deployment | Vercel (static)            |

---

## 📁 Project Structure

```
expense-tracker-frontend/
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── CategoryChart.tsx   ← Doughnut chart by category
│   │   │   └── BudgetBar.tsx       ← Budget progress bar
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx         ← Navigation sidebar
│   │   │   └── DashboardLayout.tsx ← Layout wrapper
│   │   └── ui/
│   │       ├── StatCard.tsx        ← Summary stat cards
│   │       ├── ExpenseTable.tsx    ← Expenses list table
│   │       └── ProtectedRoute.tsx  ← Auth guard
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx           ← Login with Telegram ID
│   │   ├── DashboardPage.tsx       ← Main overview
│   │   ├── ExpensesPage.tsx        ← Full expense list + delete
│   │   └── BudgetPage.tsx          ← Budget settings + status
│   │
│   ├── services/
│   │   └── api.ts                  ← Axios API client
│   │
│   ├── store/
│   │   └── auth.store.ts           ← Zustand auth state
│   │
│   ├── types/
│   │   └── index.ts                ← Shared TypeScript types
│   │
│   ├── utils/
│   │   └── constants.ts            ← Category colors, formatters
│   │
│   ├── App.tsx                     ← Router setup
│   ├── main.tsx                    ← React entry point
│   └── index.css                   ← Tailwind base styles
│
├── env.example                     ← Copy to .env
├── vercel.json                     ← SPA routing config
├── vite.config.ts
└── package.json
```

---

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/rifah07/expense-tracker-telegram
cd expense-tracker-telegram
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment

```bash
cp .env.example .env
```

Open `.env`:

```
VITE_API_URL=http://localhost:3001
```

Change to your backend URL in production.

### 4. Start dev server

```bash
npm run dev
```

Opens at `http://localhost:5173`

> Make sure your backend is running at `http://localhost:3001`

---


## 🔐 How Login Works

1. User opens the dashboard
2. Types their **Telegram numeric ID**
3. Backend finds the user (must have started the bot first)
4. Returns a **JWT token** valid for 7 days
5. Token stored in `localStorage`
6. All API requests use `Authorization: Bearer <token>`
7. On 401 → auto redirect to login

**How to find your Telegram ID:**

- Message `@userinfobot` on Telegram
- It replies with your numeric ID

---
