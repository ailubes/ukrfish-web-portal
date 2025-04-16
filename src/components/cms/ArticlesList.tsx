
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { NewsArticle } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Edit, Trash2, Plus, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

type ArticlesListProps = {
  onEdit?: (article: NewsArticle) => void;
  onNew?: () => void;
};

const ArticlesList = ({ onEdit, onNew }: ArticlesListProps) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchArticles = async () => {
    try {
      setIsRefreshing(true);
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('publish_date', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedArticles: NewsArticle[] = data ? data.map(item => ({
        id: item.id || '',
        title: item.title || '',
        content: item.content || '',
        summary: item.summary || '',
        imageUrl: item.image_url || '',
        publishDate: new Date(item.publish_date || new Date()),
        category: item.category || 'Загальні новини',
        author: item.author || 'Адміністратор',
        tags: item.tags || [],
      })) : [];

      setArticles(formattedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Помилка завантаження",
        description: "Не вдалося завантажити список новин.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm("Ви впевнені, що хочете видалити цю новину?")) {
      try {
        const { error } = await supabase
          .from('news_articles')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }

        setArticles(articles.filter(article => article.id !== id));
        toast({
          title: "Новину видалено",
          description: "Новину успішно видалено з системи.",
        });
      } catch (error) {
        console.error('Error deleting article:', error);
        toast({
          title: "Помилка видалення",
          description: "Не вдалося видалити новину.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditArticle = (article: NewsArticle) => {
    if (onEdit) {
      onEdit(article);
    }
  };

  const handleAddNew = () => {
    if (onNew) {
      onNew();
    }
  };

  const handleRefresh = () => {
    fetchArticles();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Управління новинами</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            title="Оновити список"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-1" /> 
            Створити новину
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="flex flex-col items-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mb-2" />
            <p>Завантаження новин...</p>
          </div>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Новин не знайдено. Додайте першу новину.</p>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-1" /> 
            Додати новину
          </Button>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Дата</TableHead>
                <TableHead>Заголовок</TableHead>
                <TableHead>Категорія</TableHead>
                <TableHead className="w-[150px]">Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    {format(new Date(article.publishDate), "dd MMM yyyy", { locale: uk })}
                  </TableCell>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>{article.category}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditArticle(article)}
                        title="Редагувати"
                      >
                        <Edit className="h-4 w-4" /> 
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteArticle(article.id)}
                        title="Видалити"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ArticlesList;
