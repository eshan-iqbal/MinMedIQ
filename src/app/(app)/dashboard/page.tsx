
'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  IndianRupee,
  Menu,
  Package2,
  Search,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import Link from 'next/link';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
} from 'recharts';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';

type Bill = {
  _id: string;
  billId: string;
  customerId: string;
  customerName: string;
  items: Array<{
    medicineId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  taxAmount: number;
  discount: number;
  grandTotal: number;
  paymentMethod: string;
  billDate: string;
  status: string;
};

type Customer = {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
};

type Medicine = {
  id: string;
  name: string;
  price: number;
  stock: number;
  pillsPerStrip?: number;
  stripPrice?: number;
  isPillBased?: boolean;
};

export default function Dashboard() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalCustomers: 0,
    lowStockItems: 0,
    todayRevenue: 0,
    todaySales: 0,
    monthlyRevenue: 0,
    monthlySales: 0,
  });
  const { toast } = useToast();

  // Fetch all data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch bills
      const billsResponse = await fetch('/api/bills');
      const billsData = await billsResponse.ok ? await billsResponse.json() : [];
      
      // Fetch customers
      const customersResponse = await fetch('/api/customers');
      const customersData = await customersResponse.ok ? await customersResponse.json() : [];
      
      // Fetch medicines
      const medicinesResponse = await fetch('/api/medicines');
      const medicinesData = await medicinesResponse.ok ? await medicinesResponse.json() : [];
      
      setBills(billsData);
      setCustomers(customersData);
      setMedicines(medicinesData);
      
      // Calculate statistics
      calculateStats(billsData, customersData, medicinesData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate dashboard statistics
  const calculateStats = (billsData: Bill[], customersData: Customer[], medicinesData: Medicine[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Total revenue and sales
    const totalRevenue = billsData.reduce((sum, bill) => sum + bill.grandTotal, 0);
    const totalSales = billsData.length;
    
    // Today's revenue and sales
    const todayBills = billsData.filter(bill => {
      const billDate = new Date(bill.billDate);
      return billDate >= today;
    });
    const todayRevenue = todayBills.reduce((sum, bill) => sum + bill.grandTotal, 0);
    const todaySales = todayBills.length;
    
    // Monthly revenue and sales
    const monthlyBills = billsData.filter(bill => {
      const billDate = new Date(bill.billDate);
      return billDate >= monthStart;
    });
    const monthlyRevenue = monthlyBills.reduce((sum, bill) => sum + bill.grandTotal, 0);
    const monthlySales = monthlyBills.length;
    
    // Low stock items (less than 10 units)
    const lowStockItems = medicinesData.filter(med => med.stock < 10).length;
    
    setStats({
      totalRevenue,
      totalSales,
      totalCustomers: customersData.length,
      lowStockItems,
      todayRevenue,
      todaySales,
      monthlyRevenue,
      monthlySales,
    });
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Generate chart data for recent sales
  const generateChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayBills = bills.filter(bill => {
        const billDate = new Date(bill.billDate).toISOString().split('T')[0];
        return billDate === date;
      });
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dayBills.reduce((sum, bill) => sum + bill.grandTotal, 0),
        sales: dayBills.length,
      };
    });
  };

  // Get recent sales for the table
  const recentSales = bills
    .sort((a, b) => new Date(b.billDate).getTime() - new Date(a.billDate).getTime())
    .slice(0, 5);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
        <Button 
          onClick={fetchData} 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span style={{fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '1.5rem'}}>₹</span>
              {isLoading ? '...' : stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.todayRevenue > 0 ? (
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +<span style={{fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>₹</span>{stats.todayRevenue.toFixed(2)} today
                </span>
              ) : (
                'Start making sales to see revenue'
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.totalCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCustomers > 0 ? (
                'Active customers'
              ) : (
                <Link href="/customers" className="underline">Add customers</Link>
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.totalSales}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.todaySales > 0 ? (
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{stats.todaySales} today
                </span>
              ) : (
                <Link href="/billing" className="underline">Start billing</Link>
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.lowStockItems}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.lowStockItems > 0 ? (
                <span className="text-orange-600">Needs attention</span>
              ) : (
                <Link href="/inventory" className="underline">Manage inventory</Link>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              {recentSales.length > 0 
                ? `Latest ${recentSales.length} transactions` 
                : 'No sales yet. Start billing to see recent transactions.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentSales.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.map((sale) => (
                    <TableRow key={sale._id}>
                      <TableCell className="font-medium">#{sale.billId}</TableCell>
                      <TableCell>{sale.customerName}</TableCell>
                      <TableCell>{new Date(sale.billDate).toLocaleDateString()}</TableCell>
                      <TableCell>{sale.items.length} items</TableCell>
                      <TableCell className="text-right">
                        <span style={{fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>₹</span>
                        {sale.grandTotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Package2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No sales yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start creating bills to see your sales history here.
                </p>
                <Link href="/billing">
                  <Button>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Start Billing
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales Analytics</CardTitle>
            <CardDescription>
              {bills.length > 0 
                ? 'Revenue and sales trends for the last 7 days' 
                : 'Sales data will appear here once you start making transactions.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bills.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      <span style={{fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>₹</span>{stats.monthlyRevenue.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">This Month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.monthlySales}
                    </div>
                    <div className="text-xs text-muted-foreground">Sales This Month</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={generateChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 border rounded shadow">
                              <p className="font-medium">{label}</p>
                              <p className="text-green-600">Revenue: <span style={{fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>₹</span>{payload[0]?.value}</p>
                              <p className="text-blue-600">Sales: {payload[1]?.value}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Sales"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No data yet</h3>
                <p className="text-sm text-muted-foreground">
                  Sales charts will appear here once you have transaction data.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

    