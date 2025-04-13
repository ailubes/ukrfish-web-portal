
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Member } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Plus, CreditCard, Check, X, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

type MembershipPayment = {
  id: string;
  member_id: string;
  amount: number;
  payment_date: Date;
  payment_type: string;
  payment_status: string;
  notes?: string;
};

const MembershipPayments = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<MembershipPayment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<MembershipPayment[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      member_id: "",
      amount: 0,
      payment_date: new Date().toISOString().split('T')[0],
      payment_type: "Банківський переказ",
      payment_status: "paid",
      notes: ""
    }
  });

  useEffect(() => {
    // Load members from localStorage
    const storedMembers = localStorage.getItem("members");
    if (storedMembers) {
      setMembers(JSON.parse(storedMembers));
    }
    
    // For demonstration, create mock payment data if none exists
    const storedPayments = localStorage.getItem("membershipPayments");
    if (storedPayments) {
      try {
        const parsedPayments = JSON.parse(storedPayments);
        setPayments(parsedPayments.map((p: any) => ({
          ...p,
          payment_date: new Date(p.payment_date)
        })));
      } catch (error) {
        console.error("Error parsing payments:", error);
        setPayments([]);
      }
    } else if (storedMembers) {
      // Create mock payment data
      const mockPayments: MembershipPayment[] = [];
      const parsedMembers = JSON.parse(storedMembers);
      
      parsedMembers.forEach((member: Member) => {
        // Add a random number of payments for each member
        const numPayments = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numPayments; i++) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          
          mockPayments.push({
            id: uuidv4(),
            member_id: member.id,
            amount: Math.floor(Math.random() * 5000) + 1000,
            payment_date: date,
            payment_type: i % 2 === 0 ? "Банківський переказ" : "Готівка",
            payment_status: i % 3 === 0 ? "pending" : "paid",
            notes: i % 4 === 0 ? "Щорічний внесок" : undefined
          });
        }
      });
      
      setPayments(mockPayments);
      localStorage.setItem("membershipPayments", JSON.stringify(mockPayments));
    }
  }, []);

  useEffect(() => {
    // Filter payments
    let filtered = [...payments];
    
    if (selectedMember !== "all") {
      filtered = filtered.filter(payment => payment.member_id === selectedMember);
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(payment => payment.payment_status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(payment => {
        const member = members.find(m => m.id === payment.member_id);
        return member?.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    setFilteredPayments(filtered);
  }, [payments, selectedMember, statusFilter, searchTerm, members]);

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member?.name || "Невідомий учасник";
  };
  
  const handleAddPayment = (data: any) => {
    const newPayment: MembershipPayment = {
      id: uuidv4(),
      member_id: data.member_id,
      amount: parseFloat(data.amount),
      payment_date: new Date(data.payment_date),
      payment_type: data.payment_type,
      payment_status: data.payment_status,
      notes: data.notes
    };
    
    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    
    // Save to localStorage
    localStorage.setItem("membershipPayments", JSON.stringify(updatedPayments));
    
    toast({
      title: "Платіж додано",
      description: "Новий запис про оплату членського внеску було додано"
    });
    
    setIsAddPaymentOpen(false);
    form.reset();
  };

  const getTotalAmount = (status: string = "all") => {
    return filteredPayments
      .filter(p => status === "all" || p.payment_status === status)
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  const changePaymentStatus = (id: string, status: string) => {
    const updatedPayments = payments.map(payment => 
      payment.id === id ? { ...payment, payment_status: status } : payment
    );
    
    setPayments(updatedPayments);
    localStorage.setItem("membershipPayments", JSON.stringify(updatedPayments));
    
    toast({
      title: "Статус оновлено",
      description: `Статус платежу було змінено на ${status === "paid" ? "оплачено" : "очікується"}`
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-semibold">Управління членськими внесками</h2>
        <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
          <DialogTrigger asChild>
            <Button className="mt-2 sm:mt-0">
              <Plus size={16} className="mr-2" />
              Додати платіж
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Додати новий платіж</DialogTitle>
              <DialogDescription>
                Заповніть форму, щоб додати новий запис про оплату членського внеску.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={form.handleSubmit(handleAddPayment)} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="member_id">Учасник *</Label>
                  <Select
                    onValueChange={(value) => form.setValue("member_id", value)}
                    defaultValue={form.getValues("member_id")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Виберіть учасника" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Сума (грн) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...form.register("amount")}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="payment_date">Дата оплати *</Label>
                    <Input
                      id="payment_date"
                      type="date"
                      {...form.register("payment_date")}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="payment_type">Тип оплати</Label>
                    <Select
                      onValueChange={(value) => form.setValue("payment_type", value)}
                      defaultValue={form.getValues("payment_type")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Виберіть тип оплати" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Банківський переказ">Банківський переказ</SelectItem>
                        <SelectItem value="Готівка">Готівка</SelectItem>
                        <SelectItem value="Картка">Картка</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="payment_status">Статус оплати</Label>
                    <Select
                      onValueChange={(value) => form.setValue("payment_status", value)}
                      defaultValue={form.getValues("payment_status")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Виберіть статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Оплачено</SelectItem>
                        <SelectItem value="pending">Очікується</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Примітки</Label>
                  <Textarea
                    id="notes"
                    placeholder="Додаткова інформація про платіж"
                    {...form.register("notes")}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">Зберегти</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Загальна сума
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getTotalAmount().toLocaleString()} грн
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Оплачено
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {getTotalAmount("paid").toLocaleString()} грн
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">
              Очікується
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {getTotalAmount("pending").toLocaleString()} грн
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={16} className="text-gray-400" />
          </div>
          <Input
            placeholder="Пошук за назвою учасника"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <Select
              value={selectedMember}
              onValueChange={setSelectedMember}
            >
              <SelectTrigger className="min-w-[180px]">
                <SelectValue placeholder="Учасник" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі учасники</SelectItem>
                {members.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-gray-400" />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі статуси</SelectItem>
                <SelectItem value="paid">Оплачено</SelectItem>
                <SelectItem value="pending">Очікується</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Учасник</TableHead>
              <TableHead>Сума</TableHead>
              <TableHead>Тип платежу</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Примітки</TableHead>
              <TableHead className="text-right">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {format(payment.payment_date, "dd MMM yyyy", { locale: uk })}
                  </TableCell>
                  <TableCell className="font-medium">
                    {getMemberName(payment.member_id)}
                  </TableCell>
                  <TableCell>
                    {payment.amount.toLocaleString()} грн
                  </TableCell>
                  <TableCell>
                    {payment.payment_type}
                  </TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payment.payment_status === "paid" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {payment.payment_status === "paid" ? "Оплачено" : "Очікується"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {payment.notes || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {payment.payment_status === "pending" ? (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => changePaymentStatus(payment.id, "paid")}
                        >
                          <Check size={16} className="text-green-500" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => changePaymentStatus(payment.id, "pending")}
                        >
                          <X size={16} className="text-amber-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 italic text-gray-500">
                  {payments.length === 0 
                    ? "Немає записів про оплату членських внесків" 
                    : "Немає платежів, що відповідають критеріям пошуку"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MembershipPayments;
