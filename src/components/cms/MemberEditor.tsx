
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Member } from "@/types";
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
  ArrowLeft,
  Save,
  Mail,
  Phone,
  Link as LinkIcon,
  BarChart
} from "lucide-react";

const MemberEditor = ({ 
  member, 
  onSave, 
  onCancel 
}: { 
  member?: Member, 
  onSave: () => void, 
  onCancel: () => void 
}) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    logo: "",
    membershipType: "Free" as "Free" | "Standard" | "Premium",
    email: "",
    phone: "",
    website: "",
    productionAmount: "",
    productionType: ""
  });
  const { toast } = useToast();
  const isEditing = !!member?.id;

  useEffect(() => {
    if (member) {
      setFormData({
        id: member.id || uuidv4(),
        name: member.name || "",
        description: member.description || "",
        logo: member.logo || "",
        membershipType: member.membershipType || "Free",
        email: member.email || "",
        phone: member.phone || "",
        website: member.website || "",
        productionAmount: member.productionAmount?.toString() || "",
        productionType: member.productionType || ""
      });
    }
  }, [member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name) {
      toast({
        title: "Помилка",
        description: "Назва компанії є обов'язковим полем",
        variant: "destructive"
      });
      return;
    }

    // Create or update member
    const memberData: Member = {
      id: formData.id,
      name: formData.name,
      description: formData.description,
      logo: formData.logo,
      membershipType: formData.membershipType,
      joinDate: member?.joinDate || new Date(),
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      productionAmount: formData.productionAmount ? parseFloat(formData.productionAmount) : undefined,
      productionType: formData.productionType
    };
    
    try {
      // Get existing members from localStorage
      const existingMembers = JSON.parse(localStorage.getItem("members") || "[]");
      
      let updatedMembers;
      if (isEditing) {
        // Update existing member
        updatedMembers = existingMembers.map((m: Member) => 
          m.id === memberData.id ? memberData : m
        );
        toast({
          title: "Успішно",
          description: "Дані учасника оновлено"
        });
      } else {
        // Add new member
        updatedMembers = [...existingMembers, memberData];
        toast({
          title: "Успішно",
          description: "Нового учасника додано"
        });
      }
      
      // Save to localStorage
      localStorage.setItem("members", JSON.stringify(updatedMembers));
      
      // Notify parent component
      onSave();
    } catch (error) {
      console.error("Error saving member:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти дані учасника",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft size={16} className="mr-1" />
          Назад
        </Button>
        <h2 className="text-xl font-semibold">
          {isEditing ? "Редагування учасника" : "Додавання нового учасника"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Назва компанії *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Назва компанії"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Опис</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Детальний опис компанії"
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="logo">Логотип (URL)</Label>
              <Input
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
              {formData.logo && (
                <div className="mt-2 w-16 h-16 border rounded overflow-hidden">
                  <img 
                    src={formData.logo} 
                    alt="Логотип" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/150";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="membershipType">Тип членства</Label>
              <Select
                value={formData.membershipType}
                onValueChange={(value) => handleSelectChange("membershipType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Виберіть тип членства" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Безкоштовний</SelectItem>
                  <SelectItem value="Standard">Стандартний</SelectItem>
                  <SelectItem value="Premium">Преміум</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="productionAmount">Обсяг виробництва (тон)</Label>
              <Input
                id="productionAmount"
                name="productionAmount"
                type="number"
                min="0"
                step="0.1"
                value={formData.productionAmount}
                onChange={handleChange}
                placeholder="Наприклад: 120.5"
              />
            </div>

            <div>
              <Label htmlFor="productionType">Тип виробництва</Label>
              <Select
                value={formData.productionType}
                onValueChange={(value) => handleSelectChange("productionType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Виберіть тип виробництва" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Аквакультура">Аквакультура</SelectItem>
                  <SelectItem value="Промислове рибальство">Промислове рибальство</SelectItem>
                  <SelectItem value="Змішане">Змішане</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@company.com"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Телефон</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Phone size={16} className="text-gray-400" />
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+380 XX XXX XX XX"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="website">Веб-сайт</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LinkIcon size={16} className="text-gray-400" />
                </div>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Скасувати
          </Button>
          <Button type="submit">
            <Save size={16} className="mr-2" />
            {isEditing ? "Оновити дані" : "Створити учасника"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MemberEditor;
