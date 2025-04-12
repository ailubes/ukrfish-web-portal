
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { NewsArticle } from "@/types";
import { newsArticles } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import ArticleEditor from "./ArticleEditor";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

const ArticlesList = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would be an API call
    setArticles(newsArticles);
  }, []);

  const handleDeleteArticle = (id: string) => {
    // In a real app, this would be an API call
    if (window.confirm("Ви впевнені, що хочете видалити цю новину?")) {
      setArticles(articles.filter(article => article.id !== id));
      toast({
        title: "Новину видалено",
        description: "Новину успішно видалено з системи.",
      });
    }
  };

  const handleEditArticle = (article: NewsArticle) => {
    setEditingArticle(article);
  };

  const handleSaveEdit = (updatedArticle: NewsArticle) => {
    // In a real app, this would be an API call
    setArticles(articles.map(article => 
      article.id === updatedArticle.id ? updatedArticle : article
    ));
    setEditingArticle(null);
    toast({
      title: "Новину оновлено",
      description: "Новину успішно оновлено.",
    });
  };

  const handleCancelEdit = () => {
    setEditingArticle(null);
  };

  if (editingArticle) {
    return (
      <div>
        <div className="mb-4">
          <Button variant="outline" onClick={handleCancelEdit}>
            Повернутися до списку
          </Button>
        </div>
        <ArticleEditor existingArticle={editingArticle} onSave={handleSaveEdit} />
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Управління новинами</h3>
      
      {articles.length === 0 ? (
        <p className="text-gray-500">Новин не знайдено.</p>
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
