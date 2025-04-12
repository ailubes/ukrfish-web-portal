
import { useState, useEffect } from "react";
import { NewsArticle } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from "uuid";

interface ArticleEditorProps {
  existingArticle?: NewsArticle;
  onSave?: (article: NewsArticle) => void;
}

const ArticleEditor = ({ existingArticle, onSave }: ArticleEditorProps) => {
  const isEditing = !!existingArticle;
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<NewsArticle>>({
    title: "",
    summary: "",
    content: "",
    imageUrl: "",
    category: "",
    tags: [],
    author: ""
  });
  
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (existingArticle) {
      setFormData({
        ...existingArticle,
        tags: [...existingArticle.tags], // Create a copy of the array
      });
    }
  }, [existingArticle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.summary || !formData.content || !formData.category) {
      toast({
        title: "Помилка",
        description: "Будь ласка, заповніть всі обов'язкові поля",
        variant: "destructive"
      });
      return;
    }
    
    // Create new article or update existing
    const articleToSave: NewsArticle = {
      id: existingArticle?.id || uuidv4(),
      title: formData.title || "",
      summary: formData.summary || "",
      content: formData.content || "",
      imageUrl: formData.imageUrl || "https://via.placeholder.com/800x400",
      publishDate: existingArticle?.publishDate || new Date(),
      category: formData.category || "",
      author: formData.author || "Адміністратор",
      tags: formData.tags || []
    };
    
    if (onSave) {
      onSave(articleToSave);
    } else {
      // In a real app, this would be an API call to save the article
      console.log("Article saved:", articleToSave);
      
      toast({
        title: "Новину збережено",
        description: "Вашу новину успішно збережено.",
      });
      
      // Reset form after submission
      setFormData({
        title: "",
        summary: "",
        content: "",
        imageUrl: "",
        category: "",
        tags: [],
        author: ""
      });
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">
        {isEditing ? "Редагувати новину" : "Створити нову новину"}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Заголовок *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              placeholder="Введіть заголовок новини"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="summary">Короткий опис *</Label>
            <Textarea
              id="summary"
              name="summary"
              value={formData.summary || ""}
              onChange={handleChange}
              placeholder="Короткий опис новини"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="content">Повний текст *</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content || ""}
              onChange={handleChange}
              placeholder="Повний текст новини"
              className="min-h-[200px]"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="imageUrl">URL зображення</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl || ""}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div>
            <Label htmlFor="category">Категорія *</Label>
            <Input
              id="category"
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              placeholder="Категорія новини"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="author">Автор</Label>
            <Input
              id="author"
              name="author"
              value={formData.author || ""}
              onChange={handleChange}
              placeholder="Ім'я автора"
            />
          </div>
          
          <div>
            <Label htmlFor="tags">Теги</Label>
            <div className="flex">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Додайте тег"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleAddTag}
                className="ml-2"
                variant="outline"
              >
                Додати
              </Button>
            </div>
            
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-800 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="submit">
            {isEditing ? "Оновити новину" : "Опублікувати новину"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEditor;
