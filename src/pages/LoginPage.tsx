import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import { useAuthStore } from "../store/auth.store";

export default function LoginPage() {
  const [telegramId, setTelegramId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramId.trim()) {
      setError("Please enter your Telegram ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { token, user } = await authApi.login(telegramId.trim());
      setAuth(user, token);
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(
        msg ?? "Login failed. Make sure you have started the bot first.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">💸</div>
            <h1 className="text-2xl font-bold text-gray-900">
              Expense Tracker
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Sign in with your Telegram ID
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Telegram ID
              </label>
              <input
                type="text"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                placeholder="e.g. 123456789"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* How to find ID */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-2">
              🔍 How to find your Telegram ID:
            </p>
            <ol className="space-y-1 text-gray-500 list-decimal list-inside text-xs">
              <li>Open Telegram</li>
              <li>
                Message{" "}
                <span className="font-mono bg-white px-1 rounded">
                  @userinfobot
                </span>
              </li>
              <li>It replies with your numeric ID</li>
              <li>Paste it above</li>
            </ol>
          </div>

          {/* Bot link */}
          <p className="text-center text-xs text-gray-400 mt-4">
            Don't have an account?{" "}
            <a
              href="https://t.me/ExpenseTrack_R_Bot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              Start the bot first →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
