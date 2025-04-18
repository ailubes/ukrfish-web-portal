
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArticleEditor from "../components/cms/ArticleEditor";
import ArticlesList from "../components/cms/ArticlesList";
import { useToast } from "@/hooks/use-toast";
import { Users, LayoutDashboard, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { NewsArticle } from "@/types";

const CMSPage = () => {
  const { isAdmin, user, loading, checkAdminStatus } = useAuth();
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"articles" | "create" | "edit">("articles");
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check admin status once when the component loads
    const checkAccess = async () => {
      setCheckingAdmin(true);
      
      try {
        if (!user) {
          toast({
            title: "Доступ заборонено",
            description: "Будь ласка, увійдіть в систему",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }
        
        const isUserAdmin = await checkAdminStatus();
        console.log("Admin check result in CMSPage:", isUserAdmin);
        
        if (!isUserAdmin) {
          toast({
            title: "Доступ заборонено",
            description: "У вас немає прав адміністратора",
            variant: "destructive",
          });
          navigate("/");
        }
      } catch (error) {
        console.error("Error in access check:", error);
        toast({
          title: "Помилка",
          description: "Виникла помилка при перевірці доступу",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setCheckingAdmin(false);
      }
    };
    
    checkAccess();
  }, [user, navigate, toast, checkAdminStatus]);

  const navigateToDashboard = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    navigate("/admin/dashboard");
  };

  const handleArticleSave = () => {
    // Don't navigate away, just update state
    setEditingArticle(null);
    setActiveTab("articles");
    toast({
      title: "Статтю збережено",
      description: "Зміни успішно збережено",
    });
  };

  const handleEditArticle = (article: NewsArticle) => {
    setEditingArticle(article);
    setActiveTab("edit");
  };

  const handleCloseEditor = () => {
    setEditingArticle(null);
    setActiveTab("articles");
  };

  const handleCreateNewArticle = () => {
    setEditingArticle(null);
    setActiveTab("create");
  };

  // Navigate to members page without page reload
  const handleMembersNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/admin/members");
  };

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
            <p>Перевірка доступу адміністратора...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Доступ заборонено</h2>
            <p className="mb-4">У вас немає прав адміністратора для доступу до цієї сторінки.</p>
            <Button onClick={() => navigate("/login")}>Увійти в систему</Button>
            <Button onClick={() => navigate("/")} variant="outline" className="ml-2">Повернутися на головну</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Система управління контентом</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Панель управління</h2>
            <Button variant="outline" onClick={() => navigate("/member-profile")}>Повернутися до профілю</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div 
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={handleMembersNavigation}
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Users size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Управління учасниками</h3>
                  <p className="text-sm text-gray-500">Перегляд та керування обліковими записами учасників</p>
                </div>
              </div>
            </div>
            
            <div 
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={navigateToDashboard}
            >
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <LayoutDashboard size={24} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Розширена панель управління</h3>
                  <p className="text-sm text-gray-500">Повний доступ до всіх функцій системи управління</p>
                </div>
              </div>
            </div>
          </div>
          
          {activeTab === "edit" && editingArticle ? (
            <div>
              <ArticleEditor 
                existingArticle={editingArticle} 
                onSave={handleArticleSave} 
                onCancel={handleCloseEditor} 
              />
            </div>
          ) : activeTab === "create" ? (
            <div>
              <ArticleEditor 
                onSave={handleArticleSave} 
                onCancel={handleCloseEditor} 
              />
            </div>
          ) : (
            <ArticlesList 
              onEdit={handleEditArticle}
              onNew={handleCreateNewArticle} 
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CMSPage;
