import { useState, useEffect, useRef } from "react";
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
import {
  ImagePlus,
  Save,
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Unlink,
  Undo,
  Redo,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uploadImageToSupabase } from "@/utils/imageUtils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const editorStyles = `
  .editor-preview h1 {
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 0.5em;
    color: #0057b7;
  }
  .editor-preview h2 {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 0.5em;
    color: #0057b7;
  }
  .editor-preview h3 {
    font-size: 1.25em;
    font-weight: bold;
    margin-bottom: 0.5em;
    color: #0057b7;
  }
  .editor-preview p {
    margin-bottom: 1em;
  }
  .editor-preview ul, .editor-preview ol {
    margin-left: 1.5em;
    margin-bottom: 1em;
  }
  .editor-preview ul {
    list-style-type: disc;
  }
  .editor-preview ol {
    list-style-type: decimal;
  }
  .editor-preview img {
    max-width: 100%;
    height: auto;
    margin: 1em 0;
  }
  .editor-preview a {
    color: #0057b7;
    text-decoration: underline;
  }
`;

const HtmlPreview = ({ html }: { html: string }) => {
  return (
    <>
      <style>{editorStyles}</style>
      <div 
        className="p-4 border rounded-md bg-white min-h-[400px] max-h-[800px] overflow-y-auto editor-preview"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
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
    category: "Загальні новини",
    author: "Адміністратор",
    tags: [],
  });
  const [tagsInput, setTagsInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const isEditing = !!existingArticle?.id;
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [saveAttempted, setSaveAttempted] = useState(false);
  // Add flag to prevent restoring from local storage on initial load
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    if (existingArticle) {
      setArticle(existingArticle);
      setTagsInput(existingArticle.tags?.join(", ") || "");
    }
    
    // Mark that initial load is complete after setting state from existingArticle
    setInitialLoadComplete(true);
  }, [existingArticle]);

  useEffect(() => {
    // Skip draft restoration on initial render or if saving has been attempted
    if (!initialLoadComplete || saveAttempted) return;
    
    // Skip draft restoration if editing an existing article
    if (isEditing) return;
    
    const savedContent = localStorage.getItem('article-draft');
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent);
        if (parsedContent) {
          setArticle(prev => ({...prev, ...parsedContent}));
          if (parsedContent.tagsInput) {
            setTagsInput(parsedContent.tagsInput);
          }
          
          // Only show toast once per session, not on every render
          toast({
            title: "Чернетку відновлено",
            description: "Відновлено незбережену статтю з попереднього сеансу",
          });
        }
      } catch (e) {
        console.error("Error parsing saved content:", e);
      }
    }
  }, [initialLoadComplete, saveAttempted, isEditing, toast]);
  
  // Separate effect for saving to localStorage to prevent it from running on every render
  useEffect(() => {
    // Only save to localStorage after initial load and if not editing
    if (!initialLoadComplete || isEditing) return;
    
    // Save when unmounting if we haven't attempted to save yet
    return () => {
      if (!saveAttempted && !isEditing) {
        localStorage.setItem('article-draft', JSON.stringify({
          ...article,
          tagsInput,
        }));
      }
    };
  }, [article, tagsInput, initialLoadComplete, saveAttempted, isEditing]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    // CRITICAL FIX: Prevent default form submission to avoid page reload
    e.preventDefault();
    
    if (!article.title || !article.content || !article.summary) {
      toast({
        title: "Помилка",
        description: "Будь ласка, заповніть всі обов'язкові поля.",
        variant: "destructive",
      });
      return;
    }

    if (!user || !isAdmin) {
      toast({
        title: "Помилка авторизації",
        description: "Ви повинні бути авторизовані як адміністратор щоб зберегти статтю.",
        variant: "destructive",
      });
      return;
    }

    setSaveAttempted(true);
    setIsSubmitting(true);

    try {
      const formattedTags = formatTags(tagsInput);

      if (editorRef.current) {
        setArticle(prev => ({
          ...prev,
          content: editorRef.current.innerHTML || prev.content || ""
        }));
      }

      const articleId = article.id || uuidv4();
      
      let publishDate: string;
      try {
        if (typeof article.publishDate === 'string') {
          publishDate = new Date(article.publishDate).toISOString();
        } else if (article.publishDate instanceof Date) {
          publishDate = article.publishDate.toISOString();
        } else {
          publishDate = new Date().toISOString();
        }
      } catch (error) {
        console.error("Date conversion error:", error);
        publishDate = new Date().toISOString();
      }
      
      const articleData = {
        id: articleId,
        title: article.title,
        content: article.content,
        summary: article.summary,
        image_url: article.imageUrl,
        publish_date: publishDate,
        category: article.category,
        author: article.author,
        tags: formattedTags
      };

      console.log("Saving article:", articleData);
      
      // Check authentication status before saving
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Помилка аутентифікації",
          description: "Будь ласка, увійдіть в систему перед збереженням статті.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      const { error } = await supabase
        .from('news_articles')
        .upsert(articleData as any);

      if (error) {
        console.error("Error saving article:", error);
        throw error;
      }

      // Clear draft from localStorage on successful save
      localStorage.removeItem('article-draft');

      if (onSave) {
        // Create a complete article object to pass to the onSave handler
        const savedArticle = {
          id: articleId,
          title: article.title || "",
          content: article.content || "",
          summary: article.summary || "",
          imageUrl: article.imageUrl || "",
          publishDate: new Date(publishDate),
          category: article.category || "Загальні новини",
          author: article.author || "Адміністратор",
          tags: formattedTags,
        };
        
        // Call the onSave callback with the saved article
        onSave(savedArticle);
        return; // Important: stop execution after calling onSave
      }

      toast({
        title: isEditing ? "Новину оновлено" : "Новину створено",
        description: "Зміни успішно збережено.",
      });

      // Only reset form if we're not using onSave callback
      if (!onSave) {
        setArticle({
          id: "",
          title: "",
          content: "",
          summary: "",
          imageUrl: "",
          publishDate: new Date(),
          category: "Загальні новини",
          author: "Адміністратор",
          tags: [],
        });
        setTagsInput("");
        setImageFile(null);
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
        }
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Помилка збереження",
        description: `Не вдалося зберегти статтю: ${error instanceof Error ? error.message : 'Невідома помилка'}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsImageUploading(true);
        toast({
          title: "Завантаження...",
          description: "Зображення завантажується, зачекайте, будь ласка.",
        });
        
        const uploadedImageUrl = await uploadImageToSupabase(file);
        
        if (editorRef.current) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const imgElement = document.createElement('img');
            imgElement.src = uploadedImageUrl;
            imgElement.alt = file.name;
            imgElement.style.maxWidth = '100%';
            imgElement.className = 'my-2';
            
            range.insertNode(imgElement);
            range.setStartAfter(imgElement);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            
            setArticle(prev => ({ 
              ...prev, 
              content: editorRef.current?.innerHTML || prev.content || "" 
            }));
          } else {
            const imgHtml = `<img src="${uploadedImageUrl}" alt="${file.name}" style="max-width: 100%;" class="my-2" />`;
            editorRef.current.innerHTML += imgHtml;
            setArticle(prev => ({ 
              ...prev, 
              content: editorRef.current?.innerHTML || prev.content || "" 
            }));
          }
        }
        
        setImageFile(file);
        toast({
          title: "Зображення завантажено",
          description: "Зображення успішно додано до статті.",
        });
      } catch (error) {
        console.error("Image upload error:", error);
        toast({
          title: "Помилка завантаження",
          description: "Не вдалося завантажити зображення. Перевірте підключення або розмір файлу.",
          variant: "destructive",
        });
      } finally {
        setIsImageUploading(false);
      }
    }
  };
  
  const handleCoverImageUpload = async () => {
    if (coverImageInputRef.current) {
      coverImageInputRef.current.click();
    }
  };
  
  const insertCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsImageUploading(true);
        toast({
          title: "Завантаження...",
          description: "Зображення завантажується, зачекайте, будь ласка.",
        });
        
        const uploadedImageUrl = await uploadImageToSupabase(file);
        setArticle(prev => ({ ...prev, imageUrl: uploadedImageUrl }));
        setImageFile(file);
        toast({
          title: "Зображення завантажено",
          description: "Зображення успішно додано як обкладинку статті.",
        });
      } catch (error) {
        console.error("Cover image upload error:", error);
        toast({
          title: "Помилка завантаження",
          description: "Не вдалося завантажити зображення.",
          variant: "destructive",
        });
      } finally {
        setIsImageUploading(false);
      }
    }
  };

  const handleInlineImageUpload = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const executeCommand = (command: string, value: string = '') => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    
    document.execCommand(command, false, value);
    
    if (editorRef.current) {
      setArticle(prev => ({ ...prev, content: editorRef.current?.innerHTML || prev.content || "" }));
    }
  };

  const formatBlock = (tag: string) => {
    if (editorRef.current) {
      executeCommand('formatBlock', `<${tag}>`);
    }
  };

  const handleKeyUp = () => {
    if (editorRef.current) {
      setArticle(prev => ({ ...prev, content: editorRef.current?.innerHTML || prev.content || "" }));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const insertLink = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      toast({
        title: "Виберіть текст",
        description: "Спочатку виділіть текст, який потрібно зробити посиланням",
      });
      return;
    }
    
    const url = prompt('Введіть URL посилання:', 'https://');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const renderSubmitButton = () => (
    <Button type="submit" disabled={isSubmitting || isImageUploading}>
      <Save className="mr-2 h-4 w-4" />
      {isSubmitting ? (
        "Зберігається..."
      ) : (
        isEditing ? "Оновити статтю" : "Опублікувати статтю"
      )}
    </Button>
  );
  
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.contentEditable = 'true';
      
      const handleFocus = () => {
        if (!document.queryCommandSupported('insertHTML')) {
          console.warn('HTML editing is not fully supported in this browser');
        }
      };
      
      editorRef.current.addEventListener('focus', handleFocus);
      
      return () => {
        editorRef.current?.removeEventListener('focus', handleFocus);
      };
    }
  }, []);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = editorStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div>
      {onCancel && (
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={onCancel} type="button">
            <ArrowLeft size={16} className="mr-1" />
            Назад
          </Button>
          <h2 className="text-xl font-semibold">
            {isEditing ? "Редагування новини" : "Створення нової новини"}
          </h2>
        </div>
      )}

      {!user || !isAdmin ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-red-600 mb-2">Доступ заборонено</h3>
          <p className="mb-4">Ви повинні бути авторизовані як адміністратор щоб редагувати статті.</p>
          <Button onClick={() => window.location.href = "/login"} type="button">
            Перейти до входу
          </Button>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
                value={article.category || "Загальні новини"}
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
              
              <TabsContent value="editor" className="min-h-[400px]">
                <div className="border rounded-md mb-2 bg-white">
                  <div className="flex flex-wrap gap-0.5 items-center p-2 border-b bg-slate-50">
                    <ToggleGroup type="multiple" className="flex-wrap">
                      <ToggleGroupItem value="bold" aria-label="Bold" title="Жирний" onClick={() => executeCommand('bold')}>
                        <Bold size={16} />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="italic" aria-label="Italic" title="Курсив" onClick={() => executeCommand('italic')}>
                        <Italic size={16} />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="underline" aria-label="Underline" title="Підкреслений" onClick={() => executeCommand('underline')}>
                        <Underline size={16} />
                      </ToggleGroupItem>
                    </ToggleGroup>
                    
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    
                    <ToggleGroup type="single" className="flex-wrap">
                      <ToggleGroupItem value="h1" aria-label="Heading 1" title="Заголовок 1" 
                        onClick={() => formatBlock('h1')}>
                        <Heading1 size={16} />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="h2" aria-label="Heading 2" title="Заголовок 2" 
                        onClick={() => formatBlock('h2')}>
                        <Heading2 size={16} />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="h3" aria-label="Heading 3" title="Заголовок 3" 
                        onClick={() => formatBlock('h3')}>
                        <Heading3 size={16} />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="p" aria-label="Paragraph" title="Параграф" 
                        onClick={() => formatBlock('p')}>
                        P
                      </ToggleGroupItem>
                    </ToggleGroup>
                    
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    
                    <ToggleGroup type="single" className="flex-wrap">
                      <ToggleGroupItem value="alignLeft" aria-label="Align Left" title="Вирівняти ліворуч" onClick={() => executeCommand('justifyLeft')}>
                        <AlignLeft size={16} />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="alignCenter" aria-label="Align Center" title="Вирівняти по центру" onClick={() => executeCommand('justifyCenter')}>
                        <AlignCenter size={16} />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="alignRight" aria-label="Align Right" title="Вирівняти праворуч" onClick={() => executeCommand('justifyRight')}>
                        <AlignRight size={16} />
                      </ToggleGroupItem>
                    </ToggleGroup>
                    
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    
                    <ToggleGroup type="multiple" className="flex-wrap">
                      <ToggleGroupItem value="ul" aria-label="Unordered List" title="Маркований список" 
                        onClick={() => executeCommand('insertUnorderedList')}>
                        <List size={16} />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="ol" aria-label="Ordered List" title="Нумерований список" 
                        onClick={() => executeCommand('insertOrderedList')}>
                        <ListOrdered size={16} />
                      </ToggleGroupItem>
                    </ToggleGroup>
                    
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    
                    <Button variant="ghost" size="icon" onClick={insertLink} title="Вставити посилання">
                      <Link size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => executeCommand('unlink')} title="Видалити посилання">
                      <Unlink size={16} />
                    </Button>
                    
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    
                    <Button variant="ghost" size="icon" onClick={handleInlineImageUpload} title="Вставити зображення">
                      <ImagePlus size={16} />
                    </Button>
                    <input 
                      type="file"
                      className="hidden"
                      ref={imageInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    
                    <Button variant="ghost" size="icon" onClick={() => executeCommand('undo')} title="Відмінити">
                      <Undo size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => executeCommand('redo')} title="Повторити">
                      <Redo size={16} />
                    </Button>
                  </div>
                  
                  <div
                    ref={editorRef}
                    className="p-4 min-h-[400px] focus:outline-none editor-content"
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    dangerouslySetInnerHTML={{ __html: article.content || "" }}
                    onKeyUp={handleKeyUp}
                    onPaste={handlePaste}
                    onBlur={handleKeyUp}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="html">
                <Textarea
                  id="content"
                  name="content"
                  value={article.content || ""}
                  onChange={handleChange}
                  placeholder="<p>Введіть HTML-код статті</p>"
                  required
                  rows={20}
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
              <Label htmlFor="imageUrl">URL зображення обкладинки або файл</Label>
              <div className="relative flex items-center">
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={article.imageUrl || ""}
                  onChange={(e) => setArticle(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="pr-10"
                />
                <button 
                  type="button"
                  onClick={handleCoverImageUpload}
                  className="absolute right-3 cursor-pointer"
                  disabled={isImageUploading}
                >
                  <ImagePlus className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={coverImageInputRef}
                  onChange={insertCoverImage}
                />
              </div>
              {imageFile && (
                <p className="text-xs text-green-600 mt-1">
                  Файл: {imageFile.name} (Завантажено)
                </p>
              )}
              {article.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={article.imageUrl} 
                    alt="Обкладинка" 
                    className="max-h-32 object-contain border rounded"
                  />
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Введіть URL або завантажте зображення обкладинки
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
            <Button type="submit" disabled={isSubmitting || isImageUploading}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? (
                "Зберігається..."
              ) : (
                isEditing ? "Оновити статтю" : "Опублікувати статтю"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ArticleEditor;
