
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Member } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Edit, 
  Trash2, 
  Search, 
  Shield, 
  UserCheck, 
  UserX,
  Filter 
} from "lucide-react";

const AdminMembersPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    // In a real app, we would have a proper authentication system
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (!isAdmin) {
      // Simple admin login check - should be replaced with proper auth
      toast({
        title: "Доступ заборонено",
        description: "У вас немає прав для доступу до цієї сторінки",
        variant: "destructive"
      });
      navigate("/admin");
      return;
    }
    
    setIsAuthenticated(true);
    
    // Load members from localStorage
    const storedMembers = localStorage.getItem('members');
    if (storedMembers) {
      try {
        const parsedMembers = JSON.parse(storedMembers);
        setMembers(parsedMembers);
        setFilteredMembers(parsedMembers);
      } catch (error) {
        console.error("Error parsing members data:", error);
      }
    }
  }, [navigate, toast]);

  useEffect(() => {
    // Filter members when search term or filter changes
    let results = members;
    
    if (searchTerm) {
      results = results.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.description && member.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (membershipFilter !== 'all') {
      results = results.filter(member => member.membershipType === membershipFilter);
    }
    
    setFilteredMembers(results);
  }, [searchTerm, membershipFilter, members]);

  const handleChangeMembershipType = (memberId: string, newType: 'Free' | 'Standard' | 'Premium') => {
    // Update member membership type
    const updatedMembers = members.map(member => 
      member.id === memberId ? { ...member, membershipType: newType } : member
    );
    
    setMembers(updatedMembers);
    
    // Update localStorage
    localStorage.setItem('members', JSON.stringify(updatedMembers));
    
    toast({
      title: "Статус оновлено",
      description: `Тип членства змінено на ${newType}`
    });
  };

  const handleDeleteMember = (memberId: string) => {
    if (window.confirm("Ви впевнені, що хочете видалити цього учасника?")) {
      // Delete member
      const updatedMembers = members.filter(member => member.id !== memberId);
      
      setMembers(updatedMembers);
      
      // Update localStorage
      localStorage.setItem('members', JSON.stringify(updatedMembers));
      
      toast({
        title: "Учасника видалено",
        description: "Учасник був успішно видалений з системи"
      });
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-2xl font-bold">Управління учасниками</h1>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/admin")}
              >
                Повернутися до панелі
              </Button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search size={16} className="text-gray-400" />
                </div>
                <Input
                  placeholder="Пошук за назвою або описом"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <Select
                  value={membershipFilter}
                  onValueChange={setMembershipFilter}
                >
                  <SelectTrigger className="min-w-[180px]">
                    <SelectValue placeholder="Тип членства" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всі типи</SelectItem>
                    <SelectItem value="Free">Безкоштовний</SelectItem>
                    <SelectItem value="Standard">Стандартний</SelectItem>
                    <SelectItem value="Premium">Преміум</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Компанія</TableHead>
                    <TableHead>Тип членства</TableHead>
                    <TableHead>Дата приєднання</TableHead>
                    <TableHead>Контакти</TableHead>
                    <TableHead className="text-right">Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                              <img 
                                src={member.logo || "https://via.placeholder.com/150"} 
                                alt={member.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                {member.description || "Немає опису"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={member.membershipType}
                            onValueChange={(value: 'Free' | 'Standard' | 'Premium') => 
                              handleChangeMembershipType(member.id, value)
                            }
                          >
                            <SelectTrigger className="h-8 w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Free">Безкоштовний</SelectItem>
                              <SelectItem value="Standard">Стандартний</SelectItem>
                              <SelectItem value="Premium">Преміум</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {member.joinDate 
                            ? new Date(member.joinDate).toLocaleDateString() 
                            : "Невідомо"}
                        </TableCell>
                        <TableCell>
                          <div>
                            {member.email && (
                              <p className="text-sm">
                                <span className="font-medium">Email:</span> {member.email}
                              </p>
                            )}
                            {member.phone && (
                              <p className="text-sm">
                                <span className="font-medium">Тел:</span> {member.phone}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteMember(member.id)}
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 italic text-gray-500">
                        {members.length === 0 
                          ? "Немає зареєстрованих учасників" 
                          : "Немає учасників, що відповідають критеріям пошуку"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminMembersPage;
