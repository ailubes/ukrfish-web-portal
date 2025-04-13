
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Member } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Filter,
  CreditCard,
  BarChart2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const MembersList = ({ onEdit }: { onEdit: (member: Member) => void }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      
      // For now, we'll get members from localStorage, but in a real app this would be from Supabase
      const storedMembers = localStorage.getItem('members');
      if (storedMembers) {
        const parsedMembers = JSON.parse(storedMembers);
        setMembers(parsedMembers);
        setFilteredMembers(parsedMembers);
      } else {
        setMembers([]);
        setFilteredMembers([]);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити список учасників",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return <div className="p-8 text-center">Завантаження...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Управління учасниками</h2>
      
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
      
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Компанія</TableHead>
              <TableHead>Тип членства</TableHead>
              <TableHead>Обсяг виробництва</TableHead>
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
                    <div className="flex items-center gap-1">
                      <BarChart2 size={16} className="text-blue-500" />
                      <span>{member.productionAmount || "Не вказано"} тон</span>
                      <span className="text-xs text-gray-500">
                        ({member.productionType || "Не вказано"})
                      </span>
                    </div>
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
                        onClick={() => onEdit(member)}
                      >
                        <Edit size={16} className="text-gray-500" />
                      </Button>
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
  );
};

export default MembersList;
