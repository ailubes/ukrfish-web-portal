
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Member } from "@/types";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { Users, CreditCard, BarChart2 } from "lucide-react";

type MembershipPayment = {
  id: string;
  member_id: string;
  amount: number;
  payment_date: Date;
  payment_type: string;
  payment_status: string;
  notes?: string;
};

const AnalyticsDashboard = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<MembershipPayment[]>([]);
  const [membershipStats, setMembershipStats] = useState<any[]>([]);
  const [productionStats, setProductionStats] = useState<any[]>([]);
  const [paymentsChartData, setPaymentsChartData] = useState<any[]>([]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  useEffect(() => {
    // Load data from localStorage
    const storedMembers = localStorage.getItem("members");
    if (storedMembers) {
      const parsedMembers = JSON.parse(storedMembers);
      setMembers(parsedMembers);
      
      // Calculate membership stats
      const membershipCounts = parsedMembers.reduce((acc: any, member: Member) => {
        acc[member.membershipType] = (acc[member.membershipType] || 0) + 1;
        return acc;
      }, {});
      
      const membershipStatsArray = Object.entries(membershipCounts).map(([name, value]) => ({
        name,
        value
      }));
      
      setMembershipStats(membershipStatsArray);
      
      // Calculate production stats - aggregate by type
      const productionByType = parsedMembers.reduce((acc: any, member: Member) => {
        if (member.productionType && member.productionAmount) {
          acc[member.productionType] = (acc[member.productionType] || 0) + parseFloat(member.productionAmount.toString());
        }
        return acc;
      }, {});
      
      const productionStatsArray = Object.entries(productionByType).map(([name, value]) => ({
        name,
        value
      }));
      
      setProductionStats(productionStatsArray);
    }
    
    // Load payments data
    const storedPayments = localStorage.getItem("membershipPayments");
    if (storedPayments) {
      const parsedPayments = JSON.parse(storedPayments).map((p: any) => ({
        ...p,
        payment_date: new Date(p.payment_date)
      }));
      setPayments(parsedPayments);
      
      // Prepare data for payments chart - aggregate by month
      const paymentsByMonth: any = {};
      parsedPayments.forEach((payment: MembershipPayment) => {
        const date = new Date(payment.payment_date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (!paymentsByMonth[monthKey]) {
          paymentsByMonth[monthKey] = {
            month: new Date(date.getFullYear(), date.getMonth(), 1),
            paid: 0,
            pending: 0
          };
        }
        
        if (payment.payment_status === "paid") {
          paymentsByMonth[monthKey].paid += payment.amount;
        } else {
          paymentsByMonth[monthKey].pending += payment.amount;
        }
      });
      
      // Convert to array and sort by date
      const chartData = Object.values(paymentsByMonth)
        .sort((a: any, b: any) => a.month.getTime() - b.month.getTime())
        .map((data: any) => ({
          name: new Intl.DateTimeFormat('uk', { month: 'short', year: 'numeric' }).format(data.month),
          Оплачено: data.paid,
          Очікується: data.pending
        }));
      
      setPaymentsChartData(chartData);
    }
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Аналітика та статистика</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Загальна кількість учасників
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-500" />
            <div className="text-2xl font-bold">{members.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Загальна сума внесків
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <CreditCard className="w-6 h-6 mr-2 text-green-500" />
            <div className="text-2xl font-bold">
              {payments
                .filter(p => p.payment_status === "paid")
                .reduce((sum, payment) => sum + payment.amount, 0)
                .toLocaleString()} грн
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Загальний обсяг виробництва
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <BarChart2 className="w-6 h-6 mr-2 text-purple-500" />
            <div className="text-2xl font-bold">
              {members
                .reduce((sum, member) => sum + (member.productionAmount || 0), 0)
                .toLocaleString()} тон
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Динаміка членських внесків</CardTitle>
            <CardDescription>Розподіл внесків по місяцях</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentsChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()} грн`} />
                  <Legend />
                  <Bar dataKey="Оплачено" fill="#4ade80" />
                  <Bar dataKey="Очікується" fill="#fbbf24" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Розподіл типів членства</CardTitle>
            <CardDescription>Кількість учасників за типом</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={membershipStats}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {membershipStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value} учасників`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Виробництво за типом</CardTitle>
            <CardDescription>Обсяг виробництва в тонах</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productionStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()} тон`} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
