import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { NewsArticle } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePlus, Save, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uploadImageToSupabase } from "@/utils/imageUtils";

const HtmlPreview = ({ html }: { html: string }) => {
  return (
    <div 
      className="p-4 border rounded-md bg-white min-h-[200px] max-h-[600px] overflow-y-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface ArticleEditorProps {
  existingArticle?: NewsArticle;
  onSave?: (article: NewsArticle) => void;
  onCancel?: () => void;
}

const ArticleEditor = ({ existingArticle, onSave, onCancel }: ArticleEditorProps) => {
  const [article, setArticle] = useState<Partial<NewsArticle>>({
    id: "",
    title: "",
    content: "",
    summary: "",
    imageUrl: "",
    publishDate: new Date(),
    category: "",
    author: "",
    tags: [],
  });
  const [tagsInput, setTagsInput] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  const isEditing = !!existingArticle?.id;

  useEffect(() => {
    if (existingArticle) {
      setArticle(existingArticle);
      setTagsInput(existingArticle.tags?.join(", ") || "");
    }
  }, [existingArticle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArticle((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setArticle((prev) => ({ ...prev, [name]: value }));
  };

  const formatTags = (tagsStr: string): string[] => {
    return tagsStr
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!article.title || !article.content || !article.summary) {
      toast({
        title: "Помилка",
        description: "Будь ласка, заповніть всі обов'язкові поля.",
        variant: "destructive",
      });
      return;
    }

    const formattedTags = formatTags(tagsInput);

    const completeArticle: NewsArticle = {
      id: article.id || uuidv4(),
      title: article.title || "",
      content: article.content || "",
      summary: article.summary || "",
      imageUrl: article.imageUrl || "",
      publishDate: article.publishDate || new Date(),
      category: article.category || "Загальні новини",
      author: article.author || "Адміністратор",
      tags: formattedTags,
    };

    if (onSave) {
      onSave(completeArticle);
    } else {
      toast({
        title: isEditing ? "Новину оновлено" : "Новину створено",
        description: "Зміни успішно збережено.",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadedImageUrl = await uploadImageToSupabase(file);
        setArticle(prev => ({ ...prev, imageUrl: uploadedImageUrl }));
        setImageFile(file);
        toast({
          title: "Зображення завантажено",
          description: "Зображення успішно додано до статті.",
        });
      } catch (error) {
        toast({
          title: "Помилка завантаження",
          description: "Не вдалося завантажити зображення.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div>
      {onCancel && (
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft size={16} className="mr-1" />
            Назад
          </Button>
          <h2 className="text-xl font-semibold">
            {isEditing ? "Редагування новини" : "Створення нової новини"}
          </h2>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="title">Заголовок *</Label>
            <Input
              id="title"
              name="title"
              value={article.title || ""}
              onChange={handleChange}
              placeholder="Введіть заголовок новини"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Категорія</Label>
            <Select
              value={article.category || ""}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Виберіть категорію" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Загальні новини">Загальні новини</SelectItem>
                <SelectItem value="Новини галузі">Новини галузі</SelectItem>
                <SelectItem value="Законодавство">Законодавство</SelectItem>
                <SelectItem value="Міжнародна співпраця">Міжнародна співпраця</SelectItem>
                <SelectItem value="Події та заходи">Події та заходи</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="summary">Короткий опис *</Label>
          <Textarea
            id="summary"
            name="summary"
            value={article.summary || ""}
            onChange={handleChange}
            placeholder="Введіть короткий опис статті (анонс)"
            required
            rows={2}
          />
        </div>
        
        <div>
          <Label htmlFor="content">Зміст статті *</Label>
          <Tabs defaultValue="editor">
            <TabsList className="mb-2">
              <TabsTrigger value="editor">Редактор</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="preview">Попередній перегляд</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor">
              <Textarea
                id="content"
                name="content"
                value={article.content || ""}
                onChange={handleChange}
                placeholder="Введіть текст статті"
                required
                rows={15}
                className="font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Використовуйте звичайний текст або HTML-теги для форматування.
              </p>
            </TabsContent>
            
            <TabsContent value="html">
              <Textarea
                id="content"
                name="content"
                value={article.content || ""}
                onChange={handleChange}
                placeholder="<p>Введіть HTML-код статті</p>"
                required
                rows={15}
                className="font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Редагування вмісту в HTML-форматі. Використовуйте теги p, h1-h6, ul, ol, li, strong, em, a, img тощо.
              </p>
            </TabsContent>
            
            <TabsContent value="preview">
              <HtmlPreview html={article.content || ""} />
              <p className="text-xs text-gray-500 mt-1">
                Попередній перегляд відформатованого вмісту.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="imageUrl">URL зображення або файл</Label>
            <div className="relative flex items-center">
              <Input
                id="imageUrl"
                name="imageUrl"
                value={article.imageUrl || ""}
                onChange={(e) => setArticle(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="pr-10"
              />
              <Input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                id="imageUpload"
                onChange={handleImageUpload}
              />
              <label 
                htmlFor="imageUpload" 
                className="absolute right-3 cursor-pointer"
              >
                <ImagePlus className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </label>
            </div>
            {imageFile && (
              <p className="text-xs text-green-600 mt-1">
                Файл: {imageFile.name} (Завантажено)
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Введіть URL або завантажте зображення
            </p>
          </div>

          <div>
            <Label htmlFor="tags">Теги</Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="рибальство, аквакультура, законодавство"
            />
            <p className="text-xs text-gray-500 mt-1">
              Вводьте теги через кому
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="author">Автор</Label>
            <Input
              id="author"
              name="author"
              value={article.author || ""}
              onChange={handleChange}
              placeholder="Ім'я автора"
            />
          </div>

          <div>
            <Label htmlFor="publishDate">Дата публікації</Label>
            <Input
              id="publishDate"
              name="publishDate"
              type="date"
              value={
                article.publishDate
                  ? new Date(article.publishDate).toISOString().split("T")[0]
                  : new Date().toISOString().split("T")[0]
              }
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Скасувати
            </Button>
          )}
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Оновити статтю" : "Опублікувати статтю"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEditor;
