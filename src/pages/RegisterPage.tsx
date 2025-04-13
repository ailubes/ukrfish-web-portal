
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from "uuid";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Помилка",
        description: "Паролі не співпадають",
        variant: "destructive"
      });
      return;
    }

    if (!formData.agreeTerms) {
      toast({
        title: "Помилка",
        description: "Ви повинні погодитись з умовами використання",
        variant: "destructive"
      });
      return;
    }

    // In a real app, we would send this to a backend
    // For now, we'll simulate registration success
    
    // Create a new member object
    const newMember = {
      id: uuidv4(),
      name: formData.companyName,
      logo: "https://via.placeholder.com/150",
      description: "",
      membershipType: 'Free' as const,
      joinDate: new Date(),
      email: formData.email,
      username: formData.username
    };

    // In a real app, we'd save this to a database
    // For demo purposes, we'll store in localStorage
    const existingMembers = JSON.parse(localStorage.getItem('members') || '[]');
    localStorage.setItem('members', JSON.stringify([...existingMembers, newMember]));
    
    // Also save the current user
    localStorage.setItem('currentUser', JSON.stringify(newMember));

    toast({
      title: "Успішна реєстрація",
      description: "Тепер ви можете увійти та налаштувати свій профіль"
    });

    // Redirect to member profile page
    navigate("/member-profile");
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
                  Реєстрація
                </h2>
                <p className="text-gray-text mt-2">
                  Створіть обліковий запис для доступу до можливостей ГС "Риба України"
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ваш@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="username">Логін *</Label>
                  <Input 
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Ваш логін"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="companyName">Назва компанії *</Label>
                  <Input 
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Назва вашої компанії"
                    required
                  />
                </div>

                <div className="relative">
                  <Label htmlFor="password">Пароль *</Label>
                  <div className="relative">
                    <Input 
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Мінімум 6 символів"
                      required
                      className="pr-10"
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

                <div>
                  <Label htmlFor="confirmPassword">Підтвердіть пароль *</Label>
                  <Input 
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Повторіть пароль"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-primary border-gray-300 rounded focus:ring-blue-primary"
                  />
                  <label
                    htmlFor="agreeTerms"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Я погоджуюся з <Link to="/terms" className="text-blue-primary hover:text-blue-800">умовами використання</Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                >
                  Зареєструватися
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Вже маєте обліковий запис?{" "}
                  <Link
                    to="/login"
                    className="text-blue-primary hover:text-blue-800 font-medium"
                  >
                    Увійти
                  </Link>
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

export default RegisterPage;
