
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArticleEditor from "../components/cms/ArticleEditor";
import ArticlesList from "../components/cms/ArticlesList";
import { useToast } from "@/hooks/use-toast";
import { Users, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const CMSPage = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Доступ заборонено",
        description: "Будь ласка, увійдіть в систему",
        variant: "destructive",
      });
      navigate("/login");
    } else if (!isAdmin) {
      toast({
        title: "Доступ заборонено",
        description: "У вас немає прав адміністратора",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, isAdmin, navigate, toast]);

  if (!user || !isAdmin) {
    return null;
  }

  const navigateToDashboard = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Система управління контентом</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Панель управління</h2>
            <Button variant="outline" onClick={() => navigate("/admin/members")}>Вийти</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div 
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => navigate("/admin/members")}
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
      </main>

      <Footer />
    </div>
  );
};

export default CMSPage;
