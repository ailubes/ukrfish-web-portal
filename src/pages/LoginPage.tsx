
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would handle authentication here
    console.log("Form submitted:", { email, password, remember });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-blue-primary">
                  {isLoginMode ? "Вхід в особистий кабінет" : "Реєстрація"}
                </h2>
                <p className="text-gray-text mt-2">
                  {isLoginMode
                    ? "Увійдіть, щоб отримати доступ до вашого облікового запису"
                    : "Створіть обліковий запис для доступу до можливостей ГС "Риба України""}
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-primary"
                    placeholder="ваш@email.com"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Пароль
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-primary"
                      placeholder="Введіть пароль"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-500" />
                      ) : (
                        <Eye size={18} className="text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {isLoginMode && (
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={remember}
                        onChange={() => setRemember(!remember)}
                        className="h-4 w-4 text-blue-primary border-gray-300 rounded focus:ring-blue-primary"
                      />
                      <label
                        htmlFor="remember"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Запам'ятати мене
                      </label>
                    </div>
                    <div className="text-sm">
                      <Link
                        to="/forgot-password"
                        className="text-blue-primary hover:text-blue-800"
                      >
                        Забули пароль?
                      </Link>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-primary text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors"
                >
                  {isLoginMode ? "Увійти" : "Зареєструватися"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {isLoginMode
                    ? "Не маєте облікового запису?"
                    : "Вже маєте обліковий запис?"}{" "}
                  <button
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className="text-blue-primary hover:text-blue-800 font-medium"
                  >
                    {isLoginMode ? "Зареєструватися" : "Увійти"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
