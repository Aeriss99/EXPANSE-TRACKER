'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Calendar,
  Filter,
  Download,
  Search,
  Eye,
  Edit,
  Trash2,
  Wallet,
  PiggyBank,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Input } from '@/components/ui/Input';
import { Select, expenseCategoryOptions } from '@/components/ui/Select';
import { Navbar } from '@/components/layout/Navbar';

interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
  createdAt: string;
}

interface MonthlyStats {
  total: number;
  count: number;
  byCategory: Record<string, number>;
  dailyAverage: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchExpenses();
      fetchMonthlyStats();
    }
  }, [status, selectedMonth, selectedYear, selectedCategory]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedMonth) params.append('month', selectedMonth);
      if (selectedYear) params.append('year', selectedYear);
      if (selectedCategory) params.append('category', selectedCategory);

      const response = await fetch(`/api/expenses?${params}`);
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
        setRecentExpenses(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyStats = async () => {
    try {
      const currentDate = new Date();
      const month = selectedMonth || (currentDate.getMonth() + 1).toString();
      const year = selectedYear || currentDate.getFullYear().toString();

      const params = new URLSearchParams({ month, year });
      const response = await fetch(`/api/expenses?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        
        const total = data.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
        const byCategory: Record<string, number> = {};
        data.forEach((expense: Expense) => {
          byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount;
        });

        // Calculate trend (mock data for demo)
        const lastMonthTotal = total * 0.9; // 10% less than current
        const trend = total > lastMonthTotal ? 'up' : total < lastMonthTotal ? 'down' : 'stable';
        const trendPercentage = Math.abs(((total - lastMonthTotal) / lastMonthTotal) * 100);

        setMonthlyStats({
          total,
          count: data.length,
          byCategory,
          dailyAverage: data.length > 0 ? total / new Date(parseInt(year), parseInt(month), 0).getDate() : 0,
          trend,
          trendPercentage: Math.round(trendPercentage * 10) / 10
        });
      }
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) return;

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setExpenses(expenses.filter(expense => expense.id !== id));
        setRecentExpenses(recentExpenses.filter(expense => expense.id !== id));
        fetchMonthlyStats();
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const filteredExpenses = expenses.filter(expense =>
    expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat datang kembali, {session?.user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-600">Mari lihat bagaimana keuangan Anda berjalan bulan ini.</p>
        </div>

        {/* Stats Cards */}
        {monthlyStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AnimatedCard delay={0}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className={`flex items-center text-sm ${
                    monthlyStats.trend === 'up' ? 'text-red-500' : 
                    monthlyStats.trend === 'down' ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    {monthlyStats.trend === 'up' ? <ArrowUpRight className="h-4 w-4 mr-1" /> : 
                     monthlyStats.trend === 'down' ? <ArrowDownRight className="h-4 w-4 mr-1" /> : null}
                    {monthlyStats.trendPercentage}%
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(monthlyStats.total)}
                </h3>
                <p className="text-sm text-gray-600">Total Pengeluaran Bulan Ini</p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.1}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {monthlyStats.count}
                </h3>
                <p className="text-sm text-gray-600">Jumlah Transaksi</p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <PiggyBank className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(monthlyStats.dailyAverage)}
                </h3>
                <p className="text-sm text-gray-600">Rata-rata Harian</p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-xs text-gray-500">
                    {Object.keys(monthlyStats.byCategory).length} kategori
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {Object.keys(monthlyStats.byCategory).length}
                </h3>
                <p className="text-sm text-gray-600">Kategori Aktif</p>
              </div>
            </AnimatedCard>
          </div>
        )}

        {/* Charts and Recent Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Category Breakdown */}
          <AnimatedCard className="lg:col-span-2" delay={0.4}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Pembagian Kategori</h2>
                <BarChart3 className="h-5 w-5 text-gray-400" />
              </div>
              
              {monthlyStats && Object.keys(monthlyStats.byCategory).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(monthlyStats.byCategory).map(([category, amount]) => {
                    const percentage = (amount / monthlyStats.total) * 100;
                    const categoryName = expenseCategoryOptions.find(opt => opt.value === category)?.label || category;
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <span className="text-sm font-medium text-gray-900">{categoryName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{formatCurrency(amount)}</span>
                          <span className="text-xs text-gray-400">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada data untuk bulan ini</p>
                  <Link href="/expenses/add" className="btn-primary mt-4 inline-flex">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Pengeluaran Pertama
                  </Link>
                </div>
              )}
            </div>
          </AnimatedCard>

          {/* Recent Expenses */}
          <AnimatedCard delay={0.5}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Pengeluaran Terbaru</h2>
                <Link href="/expenses" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Lihat Semua
                </Link>
              </div>
              
              {recentExpenses.length > 0 ? (
                <div className="space-y-4">
                  {recentExpenses.map((expense, index) => {
                    const categoryName = expenseCategoryOptions.find(opt => opt.value === expense.category)?.label || expense.category;
                    
                    return (
                      <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{expense.title}</h4>
                          <p className="text-sm text-gray-600">{categoryName}</p>
                          <p className="text-xs text-gray-400">{formatDate(expense.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                          <div className="flex space-x-1 mt-1">
                            <button 
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Hapus"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">Belum ada pengeluaran</p>
                  <Link href="/expenses/add" className="btn-primary inline-flex">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Pengeluaran
                  </Link>
                </div>
              )}
            </div>
          </AnimatedCard>
        </div>

        {/* Quick Actions */}
        <AnimatedCard delay={0.6}>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Aksi Cepat</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/expenses/add" className="btn-primary flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pengeluaran
              </Link>
              <Link href="/expenses" className="btn-outline flex items-center justify-center">
                <Eye className="h-4 w-4 mr-2" />
                Lihat Semua
              </Link>
              <button className="btn-outline flex items-center justify-center">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
              <button className="btn-outline flex items-center justify-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter & Cari
              </button>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
