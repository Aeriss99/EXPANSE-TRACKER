'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, expenseCategoryOptions } from '@/components/ui/Select';
import { Expense, ExpenseCategory } from '@/types';
import { formatCurrency, formatDate, getMonthName } from '@/lib/utils';

export default function ExpensesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk filter
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchExpenses();
    }
  }, [status, selectedMonth, selectedYear, selectedCategory]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedMonth && selectedYear) {
        params.append('month', selectedMonth.toString());
        params.append('year', selectedYear.toString());
      }
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/expenses?${params}`);
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter expenses berdasarkan search term
  const filteredExpenses = expenses.filter(expense =>
    expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hitung total expenses
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Anda perlu login untuk mengakses halaman ini
            </h2>
            <Button onClick={() => router.push('/auth/signin')}>
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Generate array bulan dan tahun untuk filter
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Daftar Pengeluaran
              </h1>
              <p className="text-gray-600">
                Kelola semua pengeluaran Anda
              </p>
            </div>
            <Button onClick={() => router.push('/expenses/add')}>
              Tambah Pengeluaran
            </Button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Filter & Pencarian
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bulan
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {getMonthName(month - 1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tahun
              </label>
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Kategori</option>
                {expenseCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cari
              </label>
              <Input
                type="text"
                placeholder="Cari pengeluaran..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={fetchExpenses}>
              Terapkan Filter
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Pengeluaran
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Jumlah Transaksi
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {filteredExpenses.length}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Rata-rata per Transaksi
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {filteredExpenses.length > 0 
                  ? formatCurrency(totalAmount / filteredExpenses.length)
                  : 'Rp 0'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Pengeluaran
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="px-6 py-8 text-center text-gray-500">
                Loading...
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                <p className="mb-4">
                  {expenses.length === 0 
                    ? 'Belum ada pengeluaran yang dicatat'
                    : 'Tidak ada pengeluaran yang sesuai dengan filter'
                  }
                </p>
                <Button onClick={() => router.push('/expenses/add')}>
                  Tambah Pengeluaran Pertama
                </Button>
              </div>
            ) : (
              filteredExpenses.map((expense) => (
                <div key={expense.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {expense.title}
                        </h4>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {expenseCategoryOptions.find(opt => opt.value === expense.category)?.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        {formatDate(expense.date)}
                      </p>
                      {expense.description && (
                        <p className="text-sm text-gray-600">
                          {expense.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(expense.amount)}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/expenses/${expense.id}`)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
