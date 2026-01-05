'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Plus, 
  Save, 
  ArrowLeft,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select, expenseCategoryOptions } from '@/components/ui/Select';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Navbar } from '@/components/layout/Navbar';

interface FormData {
  title: string;
  amount: string;
  date: string;
  category: string;
  description: string;
}

export default function AddExpense() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    category: '',
    description: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Judul pengeluaran wajib diisi';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Jumlah wajib diisi';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Jumlah harus berupa angka positif';
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
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          amount: Number(formData.amount),
          date: formData.date,
          category: formData.category,
          description: formData.description.trim() || null,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Error creating expense:', errorData);
        // Handle error (show toast, etc.)
      }
    } catch (error) {
      console.error('Error creating expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <AnimatedCard className="max-w-md mx-auto text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pengeluaran Berhasil Ditambah!</h2>
            <p className="text-gray-600 mb-4">Pengeluaran Anda telah disimpan dengan sukses.</p>
            <div className="loading-spinner mx-auto" />
            <p className="text-sm text-gray-500 mt-2">Mengalihkan ke dashboard...</p>
          </AnimatedCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tambah Pengeluaran Baru</h1>
              <p className="text-gray-600">Catat pengeluaran Anda untuk更好的 keuangan</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <AnimatedCard delay={0}>
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 inline mr-2" />
                    Judul Pengeluaran *
                  </label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Contoh: Belanja di supermarket"
                    error={errors.title}
                    className="text-lg"
                  />
                </div>

                {/* Amount and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="h-4 w-4 inline mr-2" />
                      Jumlah (IDR) *
                    </label>
                    <Input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      placeholder="50000"
                      error={errors.amount}
                      className="text-lg"
                      min="0"
                      step="1000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Tanggal *
                    </label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      error={errors.date}
                      className="text-lg"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="h-4 w-4 inline mr-2" />
                    Kategori *
                  </label>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    options={expenseCategoryOptions}
                    error={errors.category}
                    className="text-lg"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 inline mr-2" />
                    Deskripsi (Opsional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Tambahkan deskripsi tambahan..."
                    rows={3}
                    className="input resize-none"
                  />
                </div>

                {/* Smart Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-900 mb-1">Tips Pintar</h3>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Gunakan nama yang deskriptif untuk memudahkan pencarian</li>
                        <li>• Kategorikan pengeluaran dengan tepat untuk analisis yang lebih baik</li>
                        <li>• Tambahkan deskripsi untuk konteks yang lebih detail</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn-outline flex-1"
                    disabled={isSubmitting}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex-1 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="loading-spinner mr-2" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Pengeluaran
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </AnimatedCard>

          {/* Quick Stats */}
          <AnimatedCard delay={0.2} className="mt-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Cepat</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-gray-600">Kategori</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Total Hari Ini</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-gray-600">Rata-rata Harian</div>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}
