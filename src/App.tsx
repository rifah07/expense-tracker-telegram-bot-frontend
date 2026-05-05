import { Routes, Route, Navigate } from "react-router-dom";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-500 mt-2">Coming in Step 8 →</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PlaceholderPage title="Login" />} />
      <Route
        path="/dashboard"
        element={<PlaceholderPage title="Dashboard" />}
      />
      <Route path="/expenses" element={<PlaceholderPage title="Expenses" />} />
      <Route path="/budget" element={<PlaceholderPage title="Budget" />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="*"
        element={<PlaceholderPage title="404 — Page not found" />}
      />
    </Routes>
  );
}
