'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, expenseCategoryOptions } from '@/components/ui/Select';
import { Expense, ExpenseFormData } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface FormErrors {
  title?: string;
  amount?: string;
  date?: string;
  category?: string;
  description?: string;
}

export default function EditExpensePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const expenseId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [expense, setExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState<ExpenseFormData>({
    title: '',
    amount: '',
    date: '',
    category: 'FOOD',
    description: '',
  });

  useEffect(() => {
    if (status === 'authenticated' && expenseId) {
      fetchExpense();
    }
  }, [status, expenseId]);

  const fetchExpense = async () => {
    try {
      setLoadingData(true);
      const response = await fetch(`/api/expenses/${expenseId}`);
      
      if (response.ok) {
        const data = await response.json();
        setExpense(data);
        setFormData({
          title: data.title,
          amount: data.amount.toString(),
          date: new Date(data.date).toISOString().split('T')[0],
          category: data.category,
          description: data.description || '',
        });
      } else if (response.status === 404) {
        alert('Pengeluaran tidak ditemukan');
        router.push('/expenses');
      } else {
        alert('Gagal memuat data pengeluaran');
        router.push('/expenses');
      }
    } catch (error) {
      console.error('Error fetching expense:', error);
      alert('Terjadi kesalahan saat memuat data');
      router.push('/expenses');
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Judul pengeluaran wajib diisi';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Jumlah harus lebih dari 0';
    }

    if (!formData.date) {
      newErrors.date = 'Tanggal wajib diisi';
    }

    if (!formData.category) {
      newErrors.category = 'Kategori wajib dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (response.ok) {
        router.push('/expenses');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Gagal mengupdate pengeluaran');
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Terjadi kesalahan saat mengupdate pengeluaran');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/expenses');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Gagal menghapus pengeluaran');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Terjadi kesalahan saat menghapus pengeluaran');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (status === 'loading' || loadingData) {
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

  if (!expense) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Pengeluaran tidak ditemukan
            </h2>
            <Button onClick={() => router.push('/expenses')}>
              Kembali ke Daftar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Edit Pengeluaran
                </h1>
                <p className="text-gray-600 mt-1">
                  {expense.title} • {formatCurrency(expense.amount)}
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
              >
                Hapus
              </Button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            <Input
              label="Judul Pengeluaran"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Contoh: Belanja groceries"
              error={errors.title}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Jumlah (Rp)"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0"
                error={errors.amount}
                required
              />

              <Input
                label="Tanggal"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                error={errors.date}
                required
              />
            </div>

            <Select
              label="Kategori"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              options={expenseCategoryOptions}
              error={errors.category}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi (Opsional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Catatan tambahan tentang pengeluaran ini..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/expenses')}
                disabled={loading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Konfirmasi Hapus
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus pengeluaran "{expense.title}" sebesar {formatCurrency(expense.amount)}? 
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Menghapus...' : 'Hapus'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
