
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, User, Mail, Calendar, Loader2 } from "lucide-react";

const MemberProfilePage = () => {
  const { user, isAdmin, loading, checkAdminStatus } = useAuth();
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      if (!user) {
        toast({
          title: "Доступ заборонено",
          description: "Будь ласка, увійдіть в систему",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      
      // Force a re-check of admin status
      setCheckingAdmin(true);
      try {
        await checkAdminStatus();
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setCheckingAdmin(false);
      }
    };
    
    init();
  }, [user, navigate, toast, checkAdminStatus]);

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
            <p>Завантаження профілю...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Перевірка доступу...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Особистий кабінет</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Профіль</CardTitle>
              <CardDescription>Інформація про ваш обліковий запис</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                    <User size={40} className="text-blue-600" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Дата реєстрації</p>
                      <p>{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {isAdmin && (
                    <div className="flex items-start">
                      <ShieldAlert className="w-5 h-5 mr-2 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-600">Адміністратор</p>
                        <p className="text-sm text-gray-500">У вас є права адміністратора</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Панель користувача</CardTitle>
              <CardDescription>Доступні дії та функції</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isAdmin && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-medium text-lg flex items-center text-green-700">
                      <ShieldAlert className="mr-2 h-5 w-5" />
                      Адміністративні інструменти
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Ви маєте доступ до інструментів адміністратора
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        onClick={() => navigate("/admin")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Панель адміністратора
                      </Button>
                      <Button 
                        onClick={() => navigate("/admin/dashboard")}
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        Розширена панель
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium">Перегляд новин</h3>
                    <p className="text-sm text-gray-500 mb-3">Ознайомтеся з останніми новинами</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate("/news")}
                    >
                      Перейти до новин
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium">Членство</h3>
                    <p className="text-sm text-gray-500 mb-3">Інформація про членство у асоціації</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate("/members")}
                    >
                      Подробиці
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MemberProfilePage;
