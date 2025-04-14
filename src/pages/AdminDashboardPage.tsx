
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useToast } from "@/hooks/use-toast";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarInset,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { NewsArticle, Member } from "@/types";
import { Button } from "@/components/ui/button";
import { Newspaper, Users, LogOut, BarChart3, CreditCard, Plus } from "lucide-react";
import ArticlesList from "../components/cms/ArticlesList";
import ArticleEditor from "../components/cms/ArticleEditor";
import MembersList from "../components/cms/MembersList";
import MemberEditor from "../components/cms/MemberEditor";
import MembershipPayments from "../components/cms/MembershipPayments";
import AnalyticsDashboard from "../components/cms/AnalyticsDashboard";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboardPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("articles");
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (!isAdmin) {
      toast({
        title: "Доступ заборонено",
        description: "У вас немає прав для доступу до цієї сторінки",
        variant: "destructive"
      });
      navigate("/admin");
      return;
    }
    
    setIsAuthenticated(true);
    
    // Initialize Supabase bucket for images if needed
    const initStorage = async () => {
      try {
        const { data, error } = await supabase.storage.createBucket('images', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
        
        if (error && !error.message.includes('already exists')) {
          console.warn("Error creating storage bucket:", error);
        } else {
          console.log("Storage bucket initialized:", data);
        }
      } catch (err) {
        console.error("Error initializing storage:", err);
      }
    };
    
    initStorage();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    toast({
      title: "Вихід з системи",
      description: "Ви вийшли з системи управління контентом."
    });
    navigate("/admin");
  };

  const handleArticleSave = async () => {
    setEditingArticle(null);
    setActiveTab("articles");
    toast({
      title: "Новину збережено",
      description: "Зміни було успішно збережено."
    });
  };

  const renderContent = () => {
    if (editingArticle) {
      return (
        <ArticleEditor 
          existingArticle={editingArticle} 
          onSave={handleArticleSave}
          onCancel={() => setEditingArticle(null)}
        />
      );
    }

    if (editingMember) {
      return (
        <MemberEditor 
          member={editingMember} 
          onSave={() => {
            setEditingMember(null);
            toast({
              title: "Дані учасника збережено",
              description: "Зміни було успішно збережено."
            });
          }}
          onCancel={() => setEditingMember(null)}
        />
      );
    }

    switch (activeTab) {
      case "articles":
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Управління новинами</h2>
              <Button onClick={() => setEditingArticle({} as NewsArticle)}>
                <Plus className="mr-2 h-4 w-4" />
                Додати новину
              </Button>
            </div>
            <ArticlesList onEdit={setEditingArticle} onNew={() => setEditingArticle({} as NewsArticle)} />
          </div>
        );
      case "createArticle":
        return <ArticleEditor onSave={handleArticleSave} onCancel={() => setActiveTab("articles")} />;
      case "members":
        return <MembersList onEdit={setEditingMember} />;
      case "payments":
        return <MembershipPayments />;
      case "analytics":
        return <AnalyticsDashboard />;
      default:
        return <ArticlesList onEdit={setEditingArticle} onNew={() => setEditingArticle({} as NewsArticle)} />;
    }
  };

  if (!isAuthenticated) {
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
    <div className="min-h-screen">
      <SidebarProvider defaultOpen={true}>
        <div className="flex">
          <Sidebar>
            <SidebarHeader className="flex justify-between items-center">
              <h2 className="font-bold text-lg">Адмін-панель</h2>
              <SidebarTrigger />
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Контент</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab("articles")} 
                      isActive={activeTab === "articles"}
                    >
                      <Newspaper className="mr-2" size={18} />
                      <span>Новини</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab("createArticle")} 
                      isActive={activeTab === "createArticle"}
                    >
                      <Plus className="mr-2" size={18} />
                      <span>Створити новину</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Учасники</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab("members")} 
                      isActive={activeTab === "members"}
                    >
                      <Users className="mr-2" size={18} />
                      <span>Управління учасниками</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab("payments")} 
                      isActive={activeTab === "payments"}
                    >
                      <CreditCard className="mr-2" size={18} />
                      <span>Членські внески</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Статистика</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab("analytics")} 
                      isActive={activeTab === "analytics"}
                    >
                      <BarChart3 className="mr-2" size={18} />
                      <span>Аналітика</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>

              <div className="mt-auto">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout}>
                      <LogOut className="mr-2" size={18} />
                      <span>Вийти</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>
            </SidebarContent>
          </Sidebar>

          <SidebarInset className="p-6 w-full">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Система управління контентом</h1>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              {renderContent()}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminDashboardPage;
