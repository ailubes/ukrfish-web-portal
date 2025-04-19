import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import ArticleEditor from "../components/cms/ArticleEditor";
import ArticlesList from "../components/cms/ArticlesList";
import { useToast } from "@/hooks/use-toast";
import { Users, LayoutDashboard, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { NewsArticle } from "@/types";

const CMSPage = () => {
  const { isAdmin, user, loading, checkAdminStatus } = useAuth();
  const [accessChecked, setAccessChecked] = useState(false);
  const [currentView, setCurrentView] = useState<"articles" | "create" | "edit">("articles");
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check admin access on component mount
  useEffect(() => {
    let isMounted = true;
    
    // Set a timeout to prevent infinite loading
    const accessCheckTimeout = setTimeout(() => {
      if (isMounted && !accessChecked) {
        setAccessChecked(true);
        console.log("Admin check timed out - proceeding with current state");
      }
    }, 5000); // 5 second timeout

    const verifyAdmin = async () => {
      try {
        // Only run the check when loading is complete
        if (!loading) {
          console.log("Loading complete, checking admin access", { user, isAdmin });
          
          if (!user) {
            if (isMounted) {
              toast({
                title: "Доступ заборонено",
                description: "Будь ласка, увійдіть в систему",
                variant: "destructive",
              });
              navigate("/login");
            }
          } else {
            // Force refresh admin status
            const adminStatus = await checkAdminStatus();
            console.log("Admin status check result:", adminStatus);
            
            if (!adminStatus && isMounted) {
              toast({
                title: "Доступ заборонено",
                description: "У вас немає прав адміністратора",
                variant: "destructive",
              });
              navigate("/");
            }
          }
          
          if (isMounted) {
            setAccessChecked(true);
          }
        }
      } catch (error) {
        console.error("Error verifying admin status:", error);
        if (isMounted) {
          setAccessChecked(true);
        }
      }
    };
    
    verifyAdmin();
    
    return () => {
      isMounted = false;
      clearTimeout(accessCheckTimeout);
    };
  }, [loading, user, isAdmin, navigate, toast, accessChecked, checkAdminStatus]);

  const handleArticleSave = useCallback(() => {
    // Clear draft first before changing view to prevent draft restoration
    localStorage.removeItem('article-draft-v4');
    
    setEditingArticle(null);
    setCurrentView("articles");
    
    toast({
      title: "Статтю збережено",
      description: "Зміни успішно збережено",
    });
  }, [toast]);

  const handleEditArticle = useCallback((article: NewsArticle) => {
    // Clear any drafts before editing an existing article
    localStorage.removeItem('article-draft-v4');
    setEditingArticle(article);
    setCurrentView("edit");
  }, []);

  const handleCloseEditor = useCallback(() => {
    if (window.confirm("Ви впевнені? Незбережені зміни будуть втрачені.")) {
      // Clear draft first to prevent restoration
      localStorage.removeItem('article-draft-v4');
      
      setEditingArticle(null);
      setCurrentView("articles");
    }
  }, []);

  const handleCreateNewArticle = useCallback(() => {
    // Clear any existing draft when explicitly creating a new article
    localStorage.removeItem('article-draft-v4');
    setEditingArticle(null);
    setCurrentView("create");
  }, []);

  const handleMembersNavigation = useCallback(() => {
    navigate("/admin/members");
  }, [navigate]);

  const navigateToDashboard = useCallback(() => {
    navigate("/admin/dashboard");
  }, [navigate]);

  // Show loading state when either auth is loading or access check is pending
  if (loading || !accessChecked) {
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

  // This will never execute if the useEffect redirects, but we keep it as a fallback
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Доступ заборонено</h2>
            <p className="mb-4">У вас немає прав адміністратора для доступу до цієї сторінки.</p>
            <Button onClick={() => navigate("/login")} type="button">Увійти в систему</Button>
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
          
          {currentView === "edit" && editingArticle ? (
            <ArticleEditor 
              existingArticle={editingArticle} 
              onSave={handleArticleSave} 
              onCancel={handleCloseEditor} 
              draftStorageKey="article-draft-v4"
            />
          ) : currentView === "create" ? (
            <ArticleEditor 
              onSave={handleArticleSave} 
              onCancel={handleCloseEditor} 
              draftStorageKey="article-draft-v4"
            />
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
