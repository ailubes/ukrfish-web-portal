
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArticleEditor from "../components/cms/ArticleEditor";
import ArticlesList from "../components/cms/ArticlesList";
import { useToast } from "@/hooks/use-toast";

const CMSPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Simple authentication for demo purposes
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate against a backend
    if (username === "admin" && password === "password") {
      setIsAuthenticated(true);
      toast({
        title: "Успішний вхід",
        description: "Ви успішно увійшли в систему управління контентом.",
      });
    } else {
      toast({
        title: "Помилка входу",
        description: "Неправильний логін або пароль.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    toast({
      title: "Вихід з системи",
      description: "Ви вийшли з системи управління контентом.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Система управління контентом</h1>

        {!isAuthenticated ? (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Вхід в систему</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Логін
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-primary"
                  placeholder="admin"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Пароль
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-primary"
                  placeholder="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Увійти</Button>
              <p className="text-xs text-gray-500 mt-2">
                Для демо використовуйте: логін <span className="font-semibold">admin</span> і пароль <span className="font-semibold">password</span>
              </p>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Панель управління</h2>
              <Button variant="outline" onClick={handleLogout}>Вийти</Button>
            </div>
            
            <Tabs defaultValue="articles">
              <TabsList className="mb-4">
                <TabsTrigger value="articles">Новини</TabsTrigger>
                <TabsTrigger value="create">Створити новину</TabsTrigger>
              </TabsList>
              
              <TabsContent value="articles">
                <ArticlesList />
              </TabsContent>
              
              <TabsContent value="create">
                <ArticleEditor />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CMSPage;
