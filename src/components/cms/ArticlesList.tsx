
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
import { Edit, Trash2, Plus } from "lucide-react";
import ArticleEditor from "./ArticleEditor";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

type ArticlesListProps = {
  onEdit?: (article: NewsArticle) => void;
  onNew?: () => void;
};

const ArticlesList = ({ onEdit, onNew }: ArticlesListProps) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('publish_date', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedArticles: NewsArticle[] = data ? data.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        summary: item.summary,
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
    } else {
      setEditingArticle(article);
    }
  };

  const handleSaveEdit = async (updatedArticle: NewsArticle) => {
    try {
      const { error } = await supabase
        .from('news_articles')
        .update({
          title: updatedArticle.title,
          content: updatedArticle.content,
          summary: updatedArticle.summary,
          image_url: updatedArticle.imageUrl,
          publish_date: new Date(updatedArticle.publishDate).toISOString(),
          category: updatedArticle.category,
          author: updatedArticle.author,
          tags: updatedArticle.tags
        })
        .eq('id', updatedArticle.id);

      if (error) {
        throw error;
      }

      setArticles(articles.map(article => 
        article.id === updatedArticle.id ? updatedArticle : article
      ));
      setEditingArticle(null);
      toast({
        title: "Новину оновлено",
        description: "Новину успішно оновлено.",
      });
    } catch (error) {
      console.error('Error updating article:', error);
      toast({
        title: "Помилка оновлення",
        description: "Не вдалося оновити новину.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingArticle(null);
  };

  const handleAddNew = () => {
    if (onNew) {
      onNew();
    } else {
      setEditingArticle({} as NewsArticle);
    }
  };

  if (editingArticle && !onEdit) {
    return (
      <div>
        <div className="mb-4">
          <Button variant="outline" onClick={handleCancelEdit}>
            Повернутися до списку
          </Button>
        </div>
        <ArticleEditor existingArticle={editingArticle} onSave={handleSaveEdit} onCancel={handleCancelEdit} />
      </div>
    );
  }

  return (
    <div>
      {!onEdit && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Управління новинами</h3>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-1" /> 
            Створити новину
          </Button>
        </div>
      )}
      
      {isLoading ? (
        <p className="text-gray-500">Завантаження новин...</p>
      ) : articles.length === 0 ? (
        <p className="text-gray-500">Новин не знайдено. Додайте першу новину.</p>
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
                      >
                        <Edit className="h-4 w-4 mr-1" /> 
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteArticle(article.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
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
