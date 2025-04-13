
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Member } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Link as LinkIcon, Mail, Phone, Save } from "lucide-react";

const MemberProfilePage = () => {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    email: "",
    phone: "",
    logo: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, we would fetch this from an API
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      toast({
        title: "Необхідна авторизація",
        description: "Будь ласка, увійдіть в систему або зареєструйтесь",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(currentUser);
      setMember(userData);
      setFormData({
        name: userData.name || "",
        description: userData.description || "",
        website: userData.website || "",
        email: userData.email || "",
        phone: userData.phone || "",
        logo: userData.logo || "https://via.placeholder.com/150"
      });
    } catch (error) {
      console.error("Error parsing user data:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити дані профілю",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!member) return;
    
    // Update the member object
    const updatedMember = {
      ...member,
      name: formData.name,
      description: formData.description,
      website: formData.website,
      email: formData.email,
      phone: formData.phone,
      logo: formData.logo
    };

    // In a real app, we would send this to a backend
    // For now, we'll update the localStorage
    
    // Update in members list
    const members = JSON.parse(localStorage.getItem('members') || '[]');
    const updatedMembers = members.map((m: Member) => 
      m.id === member.id ? updatedMember : m
    );
    
    localStorage.setItem('members', JSON.stringify(updatedMembers));
    localStorage.setItem('currentUser', JSON.stringify(updatedMember));
    
    setMember(updatedMember);
    
    toast({
      title: "Профіль оновлено",
      description: "Ваші дані були успішно збережені"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Завантаження...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold mb-6">Профіль учасника</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Інформація про компанію</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="mb-4">
                      <div className="w-full aspect-square max-w-[200px] mx-auto border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                        <img 
                          src={formData.logo || "https://via.placeholder.com/150"} 
                          alt="Логотип компанії" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <Label htmlFor="logo" className="block mb-2">Логотип (URL)</Label>
                        <Input
                          id="logo"
                          name="logo"
                          value={formData.logo}
                          onChange={handleChange}
                          placeholder="https://example.com/logo.png"
                        />
                        <p className="text-xs text-gray-500 mt-1">Введіть URL зображення</p>
                      </div>
                    </div>
                    
                    <div className="text-center bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-700">Тип членства</p>
                      <p className="text-lg font-bold text-blue-900">{member?.membershipType}</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Учасник з {member?.joinDate ? new Date(member.joinDate).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 space-y-4">
                    <div>
                      <Label htmlFor="name">Назва компанії *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Назва вашої компанії"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Опис *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Додайте короткий опис вашої компанії"
                        className="min-h-[150px]"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
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
                            placeholder="https://yourwebsite.com"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <Label htmlFor="email">Email *</Label>
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
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="relative">
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
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    <Save size={16} className="mr-2" />
                    Зберегти зміни
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MemberProfilePage;
