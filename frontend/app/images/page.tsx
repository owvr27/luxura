'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ProtectedRoute from '../../components/ProtectedRoute';

type ImageInfo = {
  filename: string;
  url: string;
  uploadedAt: string;
};

export default function ImagesPage() {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token') || '';
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      
      const res = await fetch(`${apiUrl}/api/images`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to fetch images`);
      }
      
      const data = await res.json();
      setImages(data.images || []);
      setError(null);
    } catch (e: any) {
      let errorMessage = e.message || 'Failed to load images';
      
      // Better error messages for network issues
      if (e.message?.includes('fetch') || e.message?.includes('NetworkError')) {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running on port 4000.';
      } else if (e.message?.includes('401') || e.message?.includes('Unauthorized')) {
        errorMessage = 'Please log in to view images.';
      }
      
      setError(errorMessage);
      console.error('Error fetching images:', e);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">جاري تحميل الصور...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchImages}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">صور الكاميرا</h1>
            <p className="text-gray-600">عرض الصور الملتقطة من الحاويات الذكية</p>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-gray-500">
                إجمالي الصور: <strong>{images.length}</strong>
              </span>
              <button
                onClick={fetchImages}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                تحديث
              </button>
            </div>
          </div>

          {images.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">لا توجد صور</h3>
              <p className="text-gray-600">لم يتم رفع أي صور بعد من الحاويات الذكية</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image) => (
                <div
                  key={image.filename}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:scale-105"
                  onClick={() => setSelectedImage(image.url)}
                >
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${image.url}`}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Failed to load image:', image.url);
                        (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 truncate" title={image.filename}>
                      {image.filename}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(image.uploadedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Image Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-4xl max-h-full">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 left-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors z-10"
                >
                  <span className="text-2xl">✕</span>
                </button>
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${selectedImage}`}
                  alt="Full size"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                  onError={(e) => {
                    console.error('Failed to load full-size image:', selectedImage);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

